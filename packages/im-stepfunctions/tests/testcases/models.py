from dataclasses import dataclass
from typing import Generic, List, TypeVar

from pydantic import BaseModel
from schemas.evaluation_config_output import EvaluationScenarioConfig
from schemas.evaluation_output import EvaluationOutput
from schemas.training_output import TrainingOutput

LambdaOutputPayload = TypeVar("LambdaOutputPayload", bound=BaseModel)


class LambdaOutput(Generic[LambdaOutputPayload]):
    pass


@dataclass
class LambdaSuccessOutput(LambdaOutput[LambdaOutputPayload]):
    Payload: LambdaOutputPayload


@dataclass
class LambdaErrorOutput(LambdaOutput[LambdaOutputPayload]):
    Error: str


@dataclass
class IMStepFunctionsTestCase:
    training_result: List[LambdaOutput[TrainingOutput]]
    evaluation_config: List[LambdaOutput[EvaluationScenarioConfig]]
    evaluation_result: List[LambdaOutput[EvaluationOutput]]
