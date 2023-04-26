import enum
from typing import Generic, Literal, Tuple, TypeVar

import pymunk
from pong.simulation.config import BallConfig, PaddleConfig


class CollisionType(enum.IntEnum):
    BAll_COLLISION_TYPE = 1
    PADDLE_L_COLLISION_TYPE = 2
    PADDLE_R_COLLISION_TYPE = 3
    WALL_TOP_COLLISION_TYPE = 4
    WALL_BOTTOM_COLLISION_TYPE = 5
    GOAL_L_COLLISION_TYPE = 6
    GOAL_R_COLLISION_TYPE = 7


S = TypeVar("S", bound=pymunk.Shape)


class PhysicsObject(Generic[S]):
    """A physics object is a combination of a pymunk body and a pymunk shape."""

    def __init__(self, body: pymunk.Body, shape: S, collision_type: CollisionType):
        self.body = body
        self.shape = shape
        self.shape.collision_type = collision_type


class Ball(PhysicsObject[pymunk.Circle]):
    """A ball is a dynamic body that can move in any direction."""

    def __init__(self, x: int, y: int, init_velocity: Tuple[float, float], config: BallConfig):
        body = pymunk.Body()
        body.position = x, y
        body.velocity = init_velocity

        shape = pymunk.Circle(body, config.radius)
        shape.density = 1
        shape.elasticity = 1

        super().__init__(body, shape, CollisionType.BAll_COLLISION_TYPE)


class Wall(PhysicsObject[pymunk.Segment]):
    """A wall is a static body that cannot move and forms the boundaries of the simulation."""

    def __init__(self, a: Tuple[int, int], b: Tuple[int, int], collision_type: CollisionType):
        body = pymunk.Body(body_type=pymunk.Body.STATIC)

        shape = pymunk.Segment(body, a, b, 1)
        shape.elasticity = 1

        super().__init__(body, shape, collision_type=collision_type)


class Goal(Wall):
    """A goal is a static body that cannot move and forms the boundaries of the simulation."""

    def __init__(
        self,
        a: Tuple[int, int],
        b: Tuple[int, int],
        side: Literal[CollisionType.GOAL_L_COLLISION_TYPE, CollisionType.GOAL_R_COLLISION_TYPE],
    ):
        super().__init__(a, b, collision_type=side)
        self.shape.sensor = True
        self.side = side


class Paddle(PhysicsObject[pymunk.Segment]):
    """A paddle is a kinematic body that can move up and down."""

    def __init__(self, x: int, y: int, config: PaddleConfig, collision_type: CollisionType):
        body = pymunk.Body(body_type=pymunk.Body.KINEMATIC)
        body.position = x, y

        shape = pymunk.Segment(body, (0, -(config.width / 2)), (0, config.width / 2), 4)
        shape.density = 1
        shape.elasticity = 1

        self.width = config.width
        self.endurance = float(config.endurance)

        super().__init__(body, shape, collision_type)

    def top(self) -> float:
        return self.body._get_position().y + self.width / 2.0

    def bottom(self) -> float:
        return self.body._get_position().y - self.width / 2.0
