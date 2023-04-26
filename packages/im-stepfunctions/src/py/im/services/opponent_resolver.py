from typing import Tuple

from gym import Env
from im.services.memory_resolver import MemoryResolver
from pong.env.opponent import ModelOpponent, Opponent, StaticOpponent
from pong.env.spaces import ActionType
from schemas.segments.agent_config import GenomeAttributes
from schemas.segments.scenario_config import ScenarioConfig
from typing_extensions import assert_never


class OpponentResolver:
    def __init__(self, memory_resolver: MemoryResolver) -> None:
        self.memory_resolver = memory_resolver

    def resolve(self, config: ScenarioConfig) -> Tuple[GenomeAttributes, Opponent]:
        if config.__root__.scenario_type == "Wall":
            return (
                GenomeAttributes(size=1, strength=1, endurance=1, max_speed=1),
                StaticOpponent(action=ActionType.DOWN, force=0),
            )
        elif config.__root__.scenario_type == "Agent":
            agent_config = config.__root__.agent_config

            model = self.memory_resolver.resolve(
                config=config.__root__.agent_config.memory_config,
                # Pass a dummy env for now as opponents are always defined
                env=Env(),
            )

            return (
                agent_config.genome_attributes,
                ModelOpponent(model),
            )
        else:
            assert_never(config.__root__.__root__)
