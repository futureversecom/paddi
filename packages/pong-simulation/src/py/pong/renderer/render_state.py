from dataclasses import dataclass
from typing import Tuple

from pong.simulation.simulation import PongSimulation


@dataclass
class Paddle:
    position: Tuple[float, float]
    velocity: Tuple[float, float]
    width: int
    radius: float
    max_endurance: int
    endurance: float


@dataclass
class Ball:
    position: Tuple[float, float]
    radius: float


@dataclass
class RenderState:
    ball: Ball
    paddle_l: Paddle
    paddle_r: Paddle


def render_state_from_simulation_state(simulation: PongSimulation) -> RenderState:
    return RenderState(
        ball=Ball(
            position=simulation.ball.body.position,
            radius=simulation.ball.shape.radius,
        ),
        paddle_l=Paddle(
            position=simulation.paddle_l.body.position,
            width=simulation.paddle_l.width,
            radius=simulation.paddle_l.shape.radius,
            max_endurance=simulation.config.paddle_l.endurance,
            endurance=simulation.paddle_l.endurance,
            velocity=simulation.paddle_l.body.velocity,
        ),
        paddle_r=Paddle(
            position=simulation.paddle_r.body.position,
            width=simulation.paddle_r.width,
            radius=simulation.paddle_r.shape.radius,
            max_endurance=simulation.config.paddle_r.endurance,
            endurance=simulation.paddle_r.endurance,
            velocity=simulation.paddle_r.body.velocity,
        ),
    )
