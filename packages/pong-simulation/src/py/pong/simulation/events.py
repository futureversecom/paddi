from dataclasses import dataclass
from typing import Literal, Tuple

from pong.simulation.physics_objects import CollisionType

BallCollisionEventType = Literal[
    CollisionType.PADDLE_L_COLLISION_TYPE,
    CollisionType.PADDLE_R_COLLISION_TYPE,
    CollisionType.WALL_TOP_COLLISION_TYPE,
    CollisionType.WALL_BOTTOM_COLLISION_TYPE,
    CollisionType.GOAL_L_COLLISION_TYPE,
    CollisionType.GOAL_R_COLLISION_TYPE,
]


@dataclass
class BallCollisionEvent:
    collision_type: BallCollisionEventType
    position: Tuple[float, float]


# TODO: this may get extended to a union when we need to add more events
SimulationEvent = BallCollisionEvent
