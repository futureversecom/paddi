from schemas.evaluation_config_output import EvaluationScenarioConfig
from schemas.evaluation_output import EvaluationOutput
from schemas.segments.agent_config import (
    AgentConfig,
    GenomeAttributes,
    MemoryConfig,
    MemoryNode,
    TrainedNode,
)
from schemas.segments.histogram_stats import HistogramStats
from schemas.segments.scenario_config import (
    AgentScenario,
    EvaluationScenario,
    ScenarioConfig,
    WallScenario,
)
from schemas.training_output import TrainingOutput
from testcases.models import IMStepFunctionsTestCase, LambdaSuccessOutput

multi_unit_training_evaluation_scenarios = EvaluationScenarioConfig(
    scenarios=[
        EvaluationScenario(
            id="scenario_0",
            iterations=2000,
            scenario=ScenarioConfig(
                __root__=AgentScenario(
                    scenario_type="Agent",
                    agent_config=AgentConfig(
                        memory_config=MemoryNode(
                            __root__=TrainedNode(
                                type="TrainedNode",
                                memory=MemoryConfig(
                                    memory_id="model_id",
                                    memory_url="s3://opponent_model/model_key",
                                ),
                            )
                        ),
                        genome_attributes=GenomeAttributes(
                            endurance=0.4,
                            max_speed=0.4,
                            size=0.4,
                            strength=0.4,
                        ),
                    ),
                )
            ),
        ),
        EvaluationScenario(
            id="scenario_1",
            iterations=1000,
            scenario=ScenarioConfig(
                __root__=WallScenario(
                    scenario_type="Wall",
                )
            ),
        ),
    ]
)

# Happy path test case for three units of testing and two evaluation scenarios.
multi_unit_training_case = IMStepFunctionsTestCase(
    training_result=[
        LambdaSuccessOutput(
            Payload=TrainingOutput(
                output_path="s3://model_bucket/model_key",
                completed_training_units=1,
                is_completed=False,
            )
        ),
        LambdaSuccessOutput(
            Payload=TrainingOutput(
                output_path="s3://model_bucket/model_key",
                completed_training_units=2,
                is_completed=False,
            )
        ),
        LambdaSuccessOutput(
            Payload=TrainingOutput(
                output_path="s3://model_bucket/model_key",
                completed_training_units=3,
                is_completed=True,
            )
        ),
    ],
    evaluation_config=[LambdaSuccessOutput(Payload=multi_unit_training_evaluation_scenarios)],
    evaluation_result=[
        LambdaSuccessOutput(
            Payload=EvaluationOutput(
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
        ),
        LambdaSuccessOutput(
            Payload=EvaluationOutput(
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
            )
        ),
    ],
)
