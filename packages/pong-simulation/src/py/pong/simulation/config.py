from dataclasses import dataclass
from typing import Tuple

from pong.simulation.controller import Controller


@dataclass
class PaddleConfig:
    width: int
    strength: int
    endurance: int
    max_speed: int


@dataclass
class BallConfig:
    radius: int
    init_velocity: Tuple[float, float]


@dataclass
class SimulationConfig:
    width: int
    height: int
    ball: BallConfig
    paddle_l: PaddleConfig
    paddle_r: PaddleConfig
    controller_l: Controller
    controller_r: Controller
