from typing import Dict, List

from pong.renderer.render_state import RenderState
from pong.renderer.renderer import Renderer
from pong.simulation.config import SimulationConfig
from pong.simulation.events import SimulationEvent


class StubRenderer(Renderer):
    def render(self,
               state: RenderState,
               events: List[SimulationEvent],
               rewards: Dict[str, float],
               config: SimulationConfig,
               frame_index: int) -> None:
        pass

    def close(self) -> None:
        pass
