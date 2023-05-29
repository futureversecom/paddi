from pathlib import Path
from typing import Any, Dict

import boto3
from aws_lambda_powertools.utilities.parser import event_parser
from aws_lambda_powertools.utilities.typing import LambdaContext
from im.lambdas.utils.sentry import init as init_sentry
from im.services import opponent_resolver
from im.services.common.configuration import ExecutionEnvironmentConfig
from im.services.evaluation_interpreter import EvaluationInterpreter
from im.services.evaluation_service import EvaluationService
from im.services.memory_resolver import MemoryResolver
from im.services.model_loader import S3ModelLoader
from im.services.s3_replay_uploader import S3ReplayWriterService
from im.services.training_result_store import S3TrainingResultsStore
from pong.renderer.event_renderer import EventRenderer, FileEventWriter
from pong.services.evaluation_runner import EvaluationRunner
from pydantic import BaseSettings
from schemas.evaluation_output import EvaluationOutput
from schemas.evaluation_request import EvaluationRequest

init_sentry()


class Settings(BaseSettings):
    RESULTS_BUCKET: str
    MAX_EPISODE_LENGTH: int = 60 * 60 * 1

    class Config:
        env_prefix = "ACP_DEMO_"
        case_sensitive = False


# Pyright doesn't support BaseSettings, mypy handles
# this through a Pydantic plugin.
settings = Settings()  # pyright: ignore

s3_client = boto3.client("s3")

model_loader = S3ModelLoader(
    s3_client, models_bucket=settings.RESULTS_BUCKET, model_download_path=Path("/tmp")
)

result_store = S3TrainingResultsStore(
    s3_client, results_bucket=settings.RESULTS_BUCKET, model_upload_path=Path("/tmp")
)

file_event_writer = FileEventWriter("/tmp/replays")
s3_replay_writer = S3ReplayWriterService(
    s3_client=s3_client, results_bucket=settings.RESULTS_BUCKET
)
renderer = EventRenderer(file_event_writer)
evaluation_runner = EvaluationRunner(renderer)
memory_resolver = MemoryResolver(model_loader)
s3_opponent_resolver = opponent_resolver.OpponentResolver(memory_resolver)
evaluation_interpreter = EvaluationInterpreter()

evaluation_service = EvaluationService(
    training_result_store=result_store,
    opponent_resolver=s3_opponent_resolver,
    evaluation_runner=evaluation_runner,
)


@event_parser(model=EvaluationRequest)  # type: ignore[misc]
def handler(event: EvaluationRequest, context: LambdaContext) -> Dict[str, Any]:
    # TODO: ^ mypy throws an error for untyped event_parser decorator

    replay_file_path = file_event_writer.reset_out_file(f"{event.training_id}-replay.json")
    replay_prefix = f"{event.training_id}/evaluations/{event.evaluation.id}/replay.json.gz"

    # build training configuration and run training
    evaluation_service.evaluate_scenario(
        request=event,
        environment_config=ExecutionEnvironmentConfig(
            iterations_per_unit=0,
            max_episode_steps=settings.MAX_EPISODE_LENGTH,
        ),
    )

    s3_replay_writer.upload_gzipped(
        replay_file_path,
        replay_prefix,
    )

    interpretations = evaluation_interpreter.interpret(replay_file_path)

    output = EvaluationOutput(
        evaluation_id=event.evaluation.id,
        replay_path=replay_prefix,
        stats=interpretations,
    )

    return output.dict()
