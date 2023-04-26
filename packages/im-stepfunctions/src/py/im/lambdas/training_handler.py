from pathlib import Path
from typing import Any, Dict

import boto3
from aws_lambda_powertools.utilities.parser import event_parser
from aws_lambda_powertools.utilities.typing import LambdaContext
from im.services.common.configuration import ExecutionEnvironmentConfig
from im.services.memory_resolver import MemoryResolver
from im.services.model_loader import S3ModelLoader
from im.services.opponent_resolver import OpponentResolver
from im.services.train_service import TrainService
from im.services.training_result_store import S3TrainingResultsStore
from pydantic import BaseSettings
from schemas.training_request import TrainingRequest


class Settings(BaseSettings):
    RESULTS_BUCKET: str
    ITERATIONS_PER_UNIT: int
    MAX_EPISODE_LENGTH: int = 60 * 60 * 1

    class Config:
        env_prefix = "acp_demo_"
        case_sensitive = False


# Pyright doesn't support BaseSettings, mypy handles
# this through a Pydantic plugin.
settings = Settings()  # pyright: ignore


# # The boto3 client stubs only have type stubs for specific clients.
# # hence we get a "Type of "client" is partially unknown" error.
# # https://github.com/microsoft/pylance-release/issues/2809
s3_client = boto3.client("s3")  # pyright: ignore

model_loader = S3ModelLoader(
    s3_client, models_bucket=settings.RESULTS_BUCKET, model_download_path=Path("/tmp")
)

result_store = S3TrainingResultsStore(
    s3_client, results_bucket=settings.RESULTS_BUCKET, model_upload_path=Path("/tmp")
)
memory_resolver = MemoryResolver(model_loader)
opponent_resolver = OpponentResolver(memory_resolver)

train_service = TrainService(
    memory_resolver=memory_resolver,
    training_results_store=result_store,
    opponent_resolver=opponent_resolver,
)


@event_parser(model=TrainingRequest)  # type: ignore[misc]
def handler(event: TrainingRequest, context: LambdaContext) -> Dict[str, Any]:
    # TODO: ^ mypy throws an error for untyped event_parser decorator

    # build training configuration and run training
    output = train_service.train(
        event,
        environment_config=ExecutionEnvironmentConfig(
            iterations_per_unit=settings.ITERATIONS_PER_UNIT,
            max_episode_steps=settings.MAX_EPISODE_LENGTH,
        ),
    )

    return output.dict()
