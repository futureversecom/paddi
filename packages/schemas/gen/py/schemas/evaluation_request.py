# generated by datamodel-codegen:
#   filename:  evaluation_request.json

from __future__ import annotations

from pydantic import BaseModel, Field

from . import training_output
from .segments import agent_config, scenario_config


class EvaluationRequest(BaseModel):
    training_id: str = Field(..., title='Training Id')
    training_output: training_output.TrainingOutput
    genome_attributes: agent_config.GenomeAttributes
    evaluation: scenario_config.EvaluationScenario