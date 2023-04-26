# generated by datamodel-codegen:
#   filename:  im_progress_events.json

from __future__ import annotations

from typing import List, Union

from pydantic import BaseModel, Field
from typing_extensions import Literal

from . import evaluation_output, training_output


class IMStarted(BaseModel):
    event_type: Literal['IMStarted'] = Field('IMStarted', const=True)
    training_id: str


class IMTrainingUnitCompleted(BaseModel):
    event_type: Literal['IMTrainingUnitCompleted'] = Field('IMTrainingUnitCompleted', const=True)
    training_id: str
    completed_training_units: int
    is_completed: bool


class IMEvaluationStarted(BaseModel):
    event_type: Literal['IMEvaluationStarted'] = Field('IMEvaluationStarted', const=True)
    training_id: str
    evaluation_id: str


class IMTrainingCompleted(BaseModel):
    event_type: Literal['IMTrainingCompleted'] = Field('IMTrainingCompleted', const=True)
    training_id: str
    training_output: training_output.TrainingOutput


class IMEvaluationCompleted(BaseModel):
    event_type: Literal['IMEvaluationCompleted'] = Field('IMEvaluationCompleted', const=True)
    training_id: str
    evaluation_output: evaluation_output.EvaluationOutput


class IMCompleted(BaseModel):
    event_type: Literal['IMCompleted'] = Field('IMCompleted', const=True)
    training_id: str
    training_output: training_output.TrainingOutput
    evaluation_output: List[evaluation_output.EvaluationOutput]


class IMProgressEvent(BaseModel):
    __root__: Union[
        IMStarted,
        IMTrainingUnitCompleted,
        IMTrainingCompleted,
        IMEvaluationStarted,
        IMEvaluationCompleted,
        IMCompleted,
    ] = Field(..., description='Events from IM Step Function', title='IMProgressEvent')