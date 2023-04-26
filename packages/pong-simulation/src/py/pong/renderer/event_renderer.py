import os
from pathlib import Path
from typing import Callable, Dict, List, Optional

from pong.renderer.render_state import Paddle, RenderState
from pong.renderer.renderer import Renderer
from pong.simulation.config import PaddleConfig, SimulationConfig
from pong.simulation.events import BallCollisionEvent, BallCollisionEventType, SimulationEvent
from pong.simulation.physics_objects import CollisionType
from pong.simulation.simulation import ResultType
from schemas.simulation_events import BallCollisionEvent as BallCollisionEventOutput
from schemas.simulation_events import CollisionType as CollisionTypeOutput
from schemas.simulation_events import (
    FooterEvent,
    Game,
    HeaderEvent,
    PaddleFrameEvent,
    PaddleFrameState,
    PaddleProps,
    Result,
)
from schemas.simulation_events import SimulationEvent as OutputSimulationEvent
from schemas.simulation_events import TurnEndEvent, TurnStartEvent, Vec2D
from typing_extensions import assert_never


class EventWriter:
    def write(self, event: OutputSimulationEvent) -> None:
        raise NotImplementedError("")


class StdOutEventWriter(EventWriter):
    def write(self, event: OutputSimulationEvent) -> None:
        print(event.json())


class FileEventWriter(EventWriter):
    def __init__(self, output_dir: str) -> None:
        self.output_dir = output_dir
        self.output_file: Optional[Path] = None

    def reset_out_file(self, file_name: str) -> str:
        os.makedirs(self.output_dir, exist_ok=True)

        # delete the file if it exists
        self.output_file = Path(self.output_dir, file_name)

        try:
            os.remove(self.output_file)
        except FileNotFoundError:
            pass

        return str(self.output_file)

    def write(self, event: OutputSimulationEvent) -> None:
        """Writes the event to the file by appending new events."""
        assert self.output_file is not None
        with open(self.output_file, "a") as f:
            f.writelines(event.json() + "\n")


class CallbackEventWriter(EventWriter):
    def __init__(self, callback: Callable[[str], None]) -> None:
        self.callback = callback

    def write(self, event: OutputSimulationEvent) -> None:
        self.callback(event.json())


class EventRenderer(Renderer):
    def __init__(self, event_writer: EventWriter) -> None:
        self.event_writer = event_writer

    def _render_paddle(
        self,
        paddle: Paddle,
        paddle_config: PaddleConfig,
        table_width: int,
        table_height: int,
    ) -> PaddleFrameState:
        return PaddleFrameState(
            position=Vec2D(
                x=paddle.position[0] / table_width,
                y=paddle.position[1] / table_height),
            endurance=paddle.endurance / paddle_config.endurance,
            velocity=Vec2D(x=paddle.velocity[0],
                           y=paddle.velocity[1]),
        )

    def _render_paddle_frame_event(self, state: RenderState, config: SimulationConfig, frame_index: int) -> PaddleFrameEvent:
        return PaddleFrameEvent(
            event_type="PaddleFrameEvent",
            frame_index=frame_index,
            paddle_l=self._render_paddle(
                state.paddle_l, config.paddle_l, config.width, config.height),
            paddle_r=self._render_paddle(
                state.paddle_r, config.paddle_r, config.width, config.height),

        )

    def _map_collision_type(self, collision_type: BallCollisionEventType) -> CollisionTypeOutput:
        if collision_type == CollisionType.WALL_TOP_COLLISION_TYPE:
            return CollisionTypeOutput.top
        elif collision_type == CollisionType.WALL_BOTTOM_COLLISION_TYPE:
            return CollisionTypeOutput.bottom
        elif collision_type == CollisionType.GOAL_L_COLLISION_TYPE:
            return CollisionTypeOutput.left
        elif collision_type == CollisionType.GOAL_R_COLLISION_TYPE:
            return CollisionTypeOutput.right
        elif collision_type == CollisionType.PADDLE_L_COLLISION_TYPE:
            return CollisionTypeOutput.paddle_l
        elif collision_type == CollisionType.PADDLE_R_COLLISION_TYPE:
            return CollisionTypeOutput.paddle_r
        else:
            assert_never(collision_type)

    def _render_ball_collision_event(self, simulation: RenderState, event: BallCollisionEvent, config: SimulationConfig, frame_index: int) -> BallCollisionEventOutput:
        return BallCollisionEventOutput(
            event_type="BallCollisionEvent",
            frame_index=frame_index,
            collision_type=self._map_collision_type(event.collision_type),
            position=Vec2D(x=event.position[0] / config.width,
                           y=event.position[1] / config.height),
        )

    def _map_result_type(self, result: Optional[ResultType]) -> Result:
        if result is None:
            return Result.draw
        if result == "left":
            return Result.left
        elif result == "right":
            return Result.right
        else:
            assert_never(result)

    def render_turn_start(self, turn_index: int) -> None:
        self.event_writer.write(
            OutputSimulationEvent(
                __root__=TurnStartEvent(event_type="TurnStartEvent", turn_index=turn_index)
            )
        )

    def render_turn_end(self, turn_index: int, result: Optional[ResultType]) -> None:
        self.event_writer.write(
            OutputSimulationEvent(
                __root__=TurnEndEvent(
                    event_type="TurnEndEvent",
                    result=self._map_result_type(result),
                    turn_index=turn_index,
                )
            )
        )

    def render_game_start(self, config: SimulationConfig) -> None:
        self.event_writer.write(
            OutputSimulationEvent(
                __root__=HeaderEvent(
                    version="0.0.1",
                    event_type="HeaderEvent",
                    game=Game(
                        width=config.width,
                        height=config.height,
                        paddle_l=PaddleProps(
                            width=config.paddle_l.width,
                        ),
                        paddle_r=PaddleProps(
                            width=config.paddle_r.width,
                        ),
                    ),
                )
            )
        )

    def render_game_end(self) -> None:
        self.event_writer.write(
            OutputSimulationEvent(
                __root__=FooterEvent(
                    event_type="FooterEvent",
                )
            )
        )

    def render(self,
               state: RenderState,
               events: List[SimulationEvent],
               rewards: Dict[str, float],
               config: SimulationConfig,
               frame_index: int) -> None:
        # write frame event based on simulation
        self.event_writer.write(OutputSimulationEvent(
            __root__=self._render_paddle_frame_event(
                state, config, frame_index)
        ))

        for event in events:
            if isinstance(event, BallCollisionEvent):
                self.event_writer.write(
                    OutputSimulationEvent(
                        __root__=self._render_ball_collision_event(
                            state, event, config, frame_index)
                    )
                )
            else:
                assert_never(event)
