import json
import os
import time
from string import Template
from typing import Any, Dict, List

import boto3
from mypy_boto3_stepfunctions import SFNClient
from mypy_boto3_stepfunctions.type_defs import GetExecutionHistoryOutputTypeDef
from schemas.evaluation_output import EvaluationOutput
from schemas.evaluation_request import EvaluationRequest
from schemas.im_progress_events import (
    IMCompleted,
    IMEvaluationCompleted,
    IMEvaluationStarted,
    IMStarted,
    IMTrainingCompleted,
    IMTrainingUnitCompleted,
)
from schemas.segments.agent_config import AgentConfig, GenomeAttributes, MemoryNode, RootNode
from schemas.segments.histogram_stats import HistogramStats
from schemas.segments.scenario_config import ScenarioConfig, WallScenario
from schemas.training_output import TrainingOutput
from schemas.training_request import RewardConfig, TrainingRequest
from testcases.multi_unit_training import multi_unit_training_evaluation_scenarios


class TestIMStepFunctions:
    training_request = TrainingRequest(
        training_id="1234",
        player_config=AgentConfig(
            memory_config=MemoryNode(
                __root__=RootNode(
                    type="RootNode",
                )
            ),
            genome_attributes=GenomeAttributes(
                size=0.5,
                strength=0.5,
                max_speed=0.5,
                endurance=0.5,
            ),
        ),
        reward_config=RewardConfig(
            win_round=0.1,
            lose_round=0.1,
            paddle_hit=0.1,
            near_miss_multiplier=0.1,
            near_miss_exponent=0.1,
            near_miss_min_distance=0.1,
            survival_reward_multiplier=0.1,
            endurance_penalty_multiplier=0.1,
        ),
        scenario=ScenarioConfig(
            __root__=WallScenario(
                scenario_type="Wall",
            )
        ),
        training_units=3,
        training_output=None,
    )

    sfn_history: GetExecutionHistoryOutputTypeDef

    def setup_class(self) -> None:
        """Create the step function state machine before running tests."""
        with open("packages/im-stepfunctions/resources/im-stepfunctions.asl.json") as f:
            template_str = f.read()
            # python template escapes $$, which tf doesn't, so replace $ with $$
            escaped = template_str.replace("$$", "$$$$")
            definition_template = Template(escaped)

        def make_lambda_arn(name: str) -> str:
            return f"arn:aws:lambda:us-east-1:123456789012:function:{name}"

        definition = definition_template.safe_substitute(
            training_lambda_arn=make_lambda_arn("training_lambda"),
            evaluation_lambda_arn=make_lambda_arn("evaluation_lambda"),
            get_evaluation_config_lambda_arn=make_lambda_arn("get_evaluation_config_lambda"),
        )

        definition_json = json.loads(definition)
        definition_json["States"]["RunEvaluationScenarios"]["MaxConcurrency"] = 1

        # TODO: pyright boto3 seem to be missing SFn client definitions
        sfn_client: SFNClient = boto3.client(
            "stepfunctions",
            endpoint_url=os.environ.get("STEP_FUNCTIONS_ENDPOINT", "http://localhost:8083"),
        )  # pyright: ignore
        state_machine_arn = sfn_client.create_state_machine(
            name="ACPDemoIMSfn",
            definition=json.dumps(definition_json),
            roleArn="arn:aws:iam::012345678901:role/TestRole",
        )["stateMachineArn"]

        execution_arn = sfn_client.start_execution(
            stateMachineArn=f"{state_machine_arn}#MultiUnitTraining",
            name=f"im-sfn-exec-{time.time()}",
            input=json.dumps(self.training_request.dict()),
        )["executionArn"]

        while True:
            sfn_describe = sfn_client.describe_execution(executionArn=execution_arn)
            if sfn_describe["status"] != "RUNNING":
                break
            time.sleep(0.5)

        assert sfn_describe["status"] == "SUCCEEDED"

        self.sfn_history = sfn_client.get_execution_history(executionArn=execution_arn)

    def get_input_for_state(
        self, state_name: str, is_lambda_task: bool = True
    ) -> List[Dict[str, Any]]:
        calls: List[Dict[str, Any]] = []
        for idx, event in enumerate(self.sfn_history["events"]):
            if (
                "stateEnteredEventDetails" in event and event["stateEnteredEventDetails"]["name"] == state_name
            ):
                # select the next "taskScheduledEventDetails" event
                for next_event in self.sfn_history["events"][idx:]:
                    if is_lambda_task:
                        if (
                            "lambdaFunctionScheduledEventDetails" in next_event and "input" in next_event["lambdaFunctionScheduledEventDetails"]
                        ):
                            calls.append(
                                json.loads(
                                    next_event["lambdaFunctionScheduledEventDetails"]["input"]
                                )
                            )

                            break
                    else:
                        if (
                            "taskScheduledEventDetails" in next_event and "parameters" in next_event["taskScheduledEventDetails"]
                        ):
                            calls.append(
                                json.loads(next_event["taskScheduledEventDetails"]["parameters"])
                            )

                            break

        return calls

    def test_train_calls(self) -> None:
        train_calls = self.get_input_for_state("Train")

        # The training state gets called 3 times for each training unit
        assert len(train_calls) == 3
        assert TrainingRequest.parse_obj(train_calls[0]) == self.training_request

        assert TrainingRequest.parse_obj(train_calls[1]) == self.training_request.copy(
            update={
                "training_output": TrainingOutput(
                    output_path="s3://model_bucket/model_key",
                    completed_training_units=1,
                    is_completed=False,
                )
            }
        )

        assert TrainingRequest.parse_obj(train_calls[2]) == self.training_request.copy(
            update={
                "training_output": TrainingOutput(
                    output_path="s3://model_bucket/model_key",
                    completed_training_units=2,
                    is_completed=False,
                )
            }
        )

    def test_evaluation_config_calls(self) -> None:
        # Once training is complete evaluation config is called
        evaluation_config_calls = self.get_input_for_state("GetEvaluationConfig")

        assert len(evaluation_config_calls) == 1

    def test_evaluation_calls(self) -> None:
        # Then we call evaluation for each scenario
        evaluation_calls = self.get_input_for_state("RunEvaluation")
        mapped_evaluation_calls = [EvaluationRequest.parse_obj(call) for call in evaluation_calls]

        # There are two evaluation scenarios
        assert len(evaluation_calls) == 2
        assert (
            EvaluationRequest(
                training_id="1234",
                training_output=TrainingOutput(
                    output_path="s3://model_bucket/model_key",
                    completed_training_units=3,
                    is_completed=True,
                ),
                evaluation=multi_unit_training_evaluation_scenarios.scenarios[0],
                genome_attributes=self.training_request.player_config.genome_attributes,
            )
            in mapped_evaluation_calls
        )

        assert (
            EvaluationRequest(
                training_id="1234",
                training_output=TrainingOutput(
                    output_path="s3://model_bucket/model_key",
                    completed_training_units=3,
                    is_completed=True,
                ),
                evaluation=multi_unit_training_evaluation_scenarios.scenarios[1],
                genome_attributes=self.training_request.player_config.genome_attributes,
            )
            in mapped_evaluation_calls
        )

    def test_im_started_notification(self) -> None:
        # IM started notification
        im_started_notifications = self.get_input_for_state("NotifyIMStarted", False)

        assert len(im_started_notifications) == 1
        assert IMStarted.parse_obj(im_started_notifications[0]["MessageBody"]) == IMStarted(
            event_type="IMStarted",
            training_id="1234",
        )

    def test_training_unit_completed_notifications(self) -> None:
        # The training notifications get sent three times for each completion
        training_unit_completed_notifications = self.get_input_for_state(
            "NotifyIMTrainingUnitCompleted", False
        )
        assert len(training_unit_completed_notifications) == 3
        all(
            [
                notification["MessageGroupId"] == "1234"
                for notification in training_unit_completed_notifications
            ]
        )

        assert IMTrainingUnitCompleted.parse_obj(
            training_unit_completed_notifications[0]["MessageBody"]
        ) == IMTrainingUnitCompleted(
            event_type="IMTrainingUnitCompleted",
            training_id="1234",
            completed_training_units=1,
            is_completed=False,
        )

        assert IMTrainingUnitCompleted.parse_obj(
            training_unit_completed_notifications[1]["MessageBody"]
        ) == IMTrainingUnitCompleted(
            event_type="IMTrainingUnitCompleted",
            training_id="1234",
            completed_training_units=2,
            is_completed=False,
        )

        assert IMTrainingUnitCompleted.parse_obj(
            training_unit_completed_notifications[2]["MessageBody"]
        ) == IMTrainingUnitCompleted(
            event_type="IMTrainingUnitCompleted",
            training_id="1234",
            completed_training_units=3,
            is_completed=True,
        )

    def test_training_completed_notifications(self) -> None:
        # Training completed notification
        training_completed_notifications = self.get_input_for_state(
            "NotifyIMTrainingCompleted", False
        )
        assert len(training_completed_notifications) == 1
        assert IMTrainingCompleted.parse_obj(
            training_completed_notifications[0]["MessageBody"]
        ) == IMTrainingCompleted(
            event_type="IMTrainingCompleted",
            training_id="1234",
            training_output=TrainingOutput(
                output_path="s3://model_bucket/model_key",
                completed_training_units=3,
                is_completed=True,
            ),
        )

    def test_evaluation_started_notifications(self) -> None:
        # Evaluation started notification
        evaluation_started_notifications = self.get_input_for_state(
            "NotifyIMEvaluationStarted", False
        )
        assert len(evaluation_started_notifications) == 2
        mapped_evaluation_started_notifications = [
            IMEvaluationStarted.parse_obj(notification["MessageBody"])
            for notification in evaluation_started_notifications
        ]

        assert (
            IMEvaluationStarted(
                event_type="IMEvaluationStarted",
                training_id="1234",
                evaluation_id="scenario_0",
            )
            in mapped_evaluation_started_notifications
        )

        assert (
            IMEvaluationStarted(
                event_type="IMEvaluationStarted",
                training_id="1234",
                evaluation_id="scenario_1",
            )
            in mapped_evaluation_started_notifications
        )

    def test_evaluation_completed_notifications(self) -> None:
        # Evaluation completed notification
        evaluation_completed_notifications = self.get_input_for_state(
            "NotifyIMEvaluationCompleted", False
        )
        assert len(evaluation_completed_notifications) == 2
        mapped_evaluation_completed_notifications = [
            IMEvaluationCompleted.parse_obj(notification["MessageBody"])
            for notification in evaluation_completed_notifications
        ]

        assert (
            IMEvaluationCompleted(
                event_type="IMEvaluationCompleted",
                training_id="1234",
                evaluation_output=EvaluationOutput(
                    evaluation_id="scenario_0",
                    replay_path="1234/scenario_0/replay.json",
                    stats=[
                        HistogramStats(
                            type="histogram",
                            name="res_1",
                            x_axis="x_axis",
                            y_axis="y_axis",
                            categories=["cat_1", "cat_2"],
                            data=[1, 2],
                        )
                    ]
                ),
            )
            in mapped_evaluation_completed_notifications
        )

        assert (
            IMEvaluationCompleted(
                event_type="IMEvaluationCompleted",
                training_id="1234",
                evaluation_output=EvaluationOutput(
                    evaluation_id="scenario_1",
                    replay_path="1234/scenario_1/replay.json",
                    stats=[
                        HistogramStats(
                            type="histogram",
                            name="res_2",
                            x_axis="x_axis",
                            y_axis="y_axis",
                            categories=["cat_1", "cat_2"],
                            data=[1, 2],
                        )
                    ]
                ),
            )
            in mapped_evaluation_completed_notifications
        )

    def test_im_completed_notifications(self) -> None:
        # IM completed notification
        im_completed_notifications = self.get_input_for_state("NotifyIMCompleted", False)
        assert len(im_completed_notifications) == 1
        assert IMCompleted.parse_obj(im_completed_notifications[0]["MessageBody"]) == IMCompleted(
            event_type="IMCompleted",
            training_id="1234",
            training_output=TrainingOutput(
                output_path="s3://model_bucket/model_key",
                completed_training_units=3,
                is_completed=True,
            ),
            evaluation_output=[
                EvaluationOutput(
                    evaluation_id="scenario_0",
                    replay_path="1234/scenario_0/replay.json",
                    stats=[
                        HistogramStats(
                            type="histogram",
                            name="res_1",
                            x_axis="x_axis",
                            y_axis="y_axis",
                            categories=["cat_1", "cat_2"],
                            data=[1, 2],
                        )
                    ]
                ),
                EvaluationOutput(
                    evaluation_id="scenario_1",
                    replay_path="1234/scenario_1/replay.json",
                    stats=[
                        HistogramStats(
                            type="histogram",
                            name="res_2",
                            x_axis="x_axis",
                            y_axis="y_axis",
                            categories=["cat_1", "cat_2"],
                            data=[1, 2],
                        )
                    ]
                ),
            ],
        )
