from typing import Dict, List, Optional

from pong.renderer.render_state import RenderState
from pong.simulation.config import SimulationConfig
from pong.simulation.events import SimulationEvent
from pong.simulation.simulation import ResultType


class Renderer:
    def render(self,
               state: RenderState,
               events: List[SimulationEvent],
               rewards: Dict[str, float],
               config: SimulationConfig,
               frame_index: int) -> None:
        """Renders the current state of the simulation.

        @param simulation: The current state of the simulation.
        @param events: The events that happened in the last simulation step.
        @param frame_index: The index of the current frame.
        """
        raise NotImplementedError("")

    def render_turn_start(self, turn_index: int) -> None:
        pass

    def render_turn_end(self, turn_index: int, result: Optional[ResultType]) -> None:
        pass

    def render_game_start(self, config: SimulationConfig) -> None:
        pass

    def render_game_end(self) -> None:
        pass
