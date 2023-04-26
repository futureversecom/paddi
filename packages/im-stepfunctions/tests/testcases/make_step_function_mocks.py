import json
import os
from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Union

from testcases.models import (
    IMStepFunctionsTestCase,
    LambdaErrorOutput,
    LambdaOutput,
    LambdaOutputPayload,
    LambdaSuccessOutput,
)
from testcases.multi_unit_training import multi_unit_training_case


@dataclass
class StepFunctionsTestCases:
    TestCases: Dict[str, Dict[str, str]]


@dataclass
class LambdaSuccessResponse:
    StatusCode: int
    Payload: Any


@dataclass
class SQSSuccessResponse:
    MD5OfMessageBody: str = "3bcb6e8e-7h85-4375-b0bc-1a59812c6e51"
    MessageId: str = "3bcb6e8e-7h85-4375-b0bc-1a59812c6e51"


@dataclass
class StepFunctionSuccessResponse:
    Return: Union[LambdaSuccessResponse, SQSSuccessResponse]


@dataclass
class StepFunctionSuccessError:
    Error: str
    Cause: str


@dataclass
class StepFunctionErrorResponse:
    Throw: StepFunctionSuccessError


StepFunctionResponse = Union[StepFunctionSuccessResponse, StepFunctionErrorResponse]


@dataclass
class StepFunctionsMock:
    StateMachines: Dict[str, StepFunctionsTestCases]
    MockedResponses: Dict[str, Dict[str, StepFunctionResponse]]


MockedStepFunctionName = "ACPDemoIMSfn"


def make_test_defn(name: str, cases: IMStepFunctionsTestCase) -> StepFunctionsMock:
    """Make a StepFunctionsMock definition for a given test case."""

    def make_response_name(step: str) -> str:
        return f"{name}_{step}"

    def map_lambda_output_to_response(
        output: LambdaOutput[LambdaOutputPayload],
    ) -> StepFunctionResponse:
        if isinstance(output, LambdaSuccessOutput):
            return StepFunctionSuccessResponse(
                Return=LambdaSuccessResponse(StatusCode=200, Payload=output.Payload.dict())
            )
        elif isinstance(output, LambdaErrorOutput):
            return StepFunctionErrorResponse(
                Throw=StepFunctionSuccessError(Error=output.Error, Cause="")
            )
        else:
            raise Exception(f"Unknown output type: {type(output)}")

    def map_output_responses(
        outputs: List[LambdaOutput[LambdaOutputPayload]],
    ) -> Dict[str, StepFunctionResponse]:
        return {str(i): map_lambda_output_to_response(output) for i, output in enumerate(outputs)}

    def map_sqs_response() -> Dict[str, StepFunctionResponse]:
        num_of_notifications = len(cases.training_result) * 1 + len(cases.evaluation_result) * 2 + 3

        return {
            str(i): StepFunctionSuccessResponse(Return=SQSSuccessResponse())
            for i in range(0, num_of_notifications)
        }

    return StepFunctionsMock(
        StateMachines={
            MockedStepFunctionName: StepFunctionsTestCases(
                TestCases={
                    name: {
                        "Train": make_response_name("Train"),
                        "GetEvaluationConfig": make_response_name("GetEvaluationConfig"),
                        "RunEvaluation": make_response_name("RunEvaluation"),
                        # SQS mocks
                        "NotifyIMStarted": make_response_name("SQSResponse"),
                        "NotifyIMTrainingUnitCompleted": make_response_name("SQSResponse"),
                        "NotifyIMTrainingCompleted": make_response_name("SQSResponse"),
                        "NotifyIMEvaluationStarted": make_response_name("SQSResponse"),
                        "NotifyIMEvaluationCompleted": make_response_name("SQSResponse"),
                        "NotifyIMCompleted": make_response_name("SQSResponse"),
                    }
                }
            )
        },
        MockedResponses={
            make_response_name("Train"): map_output_responses(cases.training_result),
            make_response_name("GetEvaluationConfig"): map_output_responses(
                cases.evaluation_config
            ),
            make_response_name("RunEvaluation"): map_output_responses(cases.evaluation_result),
            make_response_name("SQSResponse"): map_sqs_response(),
        },
    )


def make_test_cases(cases: Dict[str, IMStepFunctionsTestCase]) -> StepFunctionsMock:
    """Make a StepFunctionsMock definition for a set of test cases."""
    aggregated: StepFunctionsMock = StepFunctionsMock(
        StateMachines={MockedStepFunctionName: StepFunctionsTestCases(TestCases={})},
        MockedResponses={},
    )

    for name, case in cases.items():
        test_defn = make_test_defn(name, case)
        aggregated.StateMachines[MockedStepFunctionName].TestCases.update(
            test_defn.StateMachines[MockedStepFunctionName].TestCases
        )
        aggregated.MockedResponses.update(test_defn.MockedResponses)

    return aggregated


if __name__ == "__main__":
    mocked_test_cases = make_test_cases(
        {
            "MultiUnitTraining": multi_unit_training_case,
        }
    )

    # Write the test cases to a file.
    with open(
        os.path.join(os.path.dirname(__file__), "../..", "resources", "im-stepfunctions.mock.json"),
        "w"
    ) as f:
        json.dump(asdict(mocked_test_cases), f, indent=2)
