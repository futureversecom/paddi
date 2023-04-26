from typing import Any, Dict

from aws_lambda_powertools.utilities.typing import LambdaContext
from schemas.evaluation_config_output import EvaluationScenarioConfig
from schemas.segments.agent_config import (
    AgentConfig,
    GenomeAttributes,
    MemoryConfig,
    MemoryNode,
    TrainedNode,
)
from schemas.segments.scenario_config import (
    AgentScenario,
    EvaluationScenario,
    ScenarioConfig,
    WallScenario,
)


def handler(event: Any, context: LambdaContext) -> Dict[str, Any]:
    # TODO: ^ mypy throws an error for untyped event_parser decorator

    # TODO: return static config to play against the wall for now
    config = EvaluationScenarioConfig(
        scenarios=[
            EvaluationScenario(
                id="Wall",
                iterations=100,
                scenario=ScenarioConfig(
                    __root__=WallScenario(
                        scenario_type="Wall",
                    )
                ),
            ),
            EvaluationScenario(
                id="AllRounder",
                iterations=100,
                scenario=ScenarioConfig(
                    __root__=AgentScenario(
                        scenario_type="Agent",
                        agent_config=AgentConfig(
                            genome_attributes=GenomeAttributes(
                                size=0.5454545454545454,
                                strength=0.16666666666666666,
                                max_speed=0.47368421052631576,
                                endurance=1,
                            ),
                            memory_config=MemoryNode(
                                __root__=TrainedNode(
                                    type="TrainedNode",
                                    memory=MemoryConfig(
                                        memory_id="Balanced",
                                        memory_url="https://d1igu04zf7rfdu.cloudfront.net/training_models/balanced.zip",
                                    )
                                )
                            )
                        )
                    ),
                ),
            ),
            EvaluationScenario(
                id="Buff",
                iterations=100,
                scenario=ScenarioConfig(
                    __root__=AgentScenario(
                        scenario_type="Agent",
                        agent_config=AgentConfig(
                            genome_attributes=GenomeAttributes(
                                size=1,
                                strength=0,
                                max_speed=0.05263157894736842,
                                endurance=0.25,
                            ),
                            memory_config=MemoryNode(
                                __root__=TrainedNode(
                                    type="TrainedNode",
                                    memory=MemoryConfig(
                                        memory_id="Heavy",
                                        memory_url="https://d1igu04zf7rfdu.cloudfront.net/training_models/heavy.zip",
                                    )
                                )
                            )
                        )
                    ),
                ),
            ),
            EvaluationScenario(
                id="Nimble",
                iterations=100,
                scenario=ScenarioConfig(
                    __root__=AgentScenario(
                        scenario_type="Agent",
                        agent_config=AgentConfig(
                            genome_attributes=GenomeAttributes(
                                size=0.09090909090909091,
                                strength=0,
                                max_speed=1,
                                endurance=1,
                            ),
                            memory_config=MemoryNode(
                                __root__=TrainedNode(
                                    type="TrainedNode",
                                    memory=MemoryConfig(
                                        memory_id="Light",
                                        memory_url="https://d1igu04zf7rfdu.cloudfront.net/training_models/light.zip",
                                    )
                                )
                            )
                        )
                    ),
                ),
            ),
        ]
    )

    return config.dict()
