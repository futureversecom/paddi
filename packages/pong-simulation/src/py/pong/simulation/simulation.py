from typing import Any, Callable, List, Literal, Optional, TypedDict, TypeVar, cast

import pymunk
from pong.simulation.config import PaddleConfig, SimulationConfig
from pong.simulation.controller import Action
from pong.simulation.events import BallCollisionEvent, BallCollisionEventType, SimulationEvent
from pong.simulation.physics_objects import Ball, CollisionType, Goal, Paddle, PhysicsObject, Wall
from typing_extensions import assert_never

WallsDict = TypedDict(
    "WallsDict",
    {
        "top": Wall,
        "bottom": Wall,
        "left": Goal,
        "right": Goal,
    },
)

ResultType = Literal["left", "right"]

CollisionHandler = Callable[[pymunk.Arbiter, pymunk.Space, Any], bool]


class PongSimulation:
    """Simulates the pong game using pymunk physics in a headless environment."""

    """
    Which side won.
    """
    result: Optional[ResultType]

    def __init__(self, config: SimulationConfig):
        """Creates a new simulation with the given configuration."""
        self.time = 0.0
        self.config = config
        self.top = config.height - 1
        self.bottom = 0
        self.right = config.width - 1
        self.left = 0
        self.controller_l = config.controller_l
        self.controller_r = config.controller_r
        self.middle_x = int(config.width / 2)
        self.middle_y = int(config.height / 2)

        self.space = pymunk.Space()

        # Instantiate the physics objects
        self.walls = self._build_walls()
        self.ball = self._add_object(
            Ball(self.middle_x, self.middle_y, config.ball.init_velocity, config.ball)
        )
        self.paddle_l = self._add_object(
            Paddle(
                self.left + 40,
                self.middle_y,
                config.paddle_l,
                CollisionType.PADDLE_L_COLLISION_TYPE,
            )
        )
        self.paddle_r = self._add_object(
            Paddle(
                self.right - 40,
                self.middle_y,
                config.paddle_r,
                CollisionType.PADDLE_R_COLLISION_TYPE,
            )
        )

        # register collision handlers
        self.goal_l_collision_handle = self.space.add_collision_handler(
            CollisionType.BAll_COLLISION_TYPE, CollisionType.GOAL_L_COLLISION_TYPE)

        # if goal left is hit, then the right player wins
        self.goal_l_collision_handle.begin = self._handle_goal_collision(
            win_side="right")

        self.goal_r_collision_handle = self.space.add_collision_handler(
            CollisionType.BAll_COLLISION_TYPE, CollisionType.GOAL_R_COLLISION_TYPE)

        # if goal right is hit, then the left player wins
        self.goal_r_collision_handle.begin = self._handle_goal_collision(
            win_side="left")

        # Register event handlers (collision handler that just emit events, and has no special logic)
        self._register_event_handlers()

        # Which side won.
        self.result = None

        self._events: List[SimulationEvent] = []

    # mypy doesn't support higher-kinded types
    # https://github.com/python/typing/issues/548
    PhysicsObjectTypeVar = TypeVar(
        "PhysicsObjectTypeVar", bound=PhysicsObject  # type: ignore[type-arg]
    )

    def _add_object(self, object: PhysicsObjectTypeVar) -> PhysicsObjectTypeVar:
        """Adds a physics object to the simulation."""
        self.space.add(object.body, object.shape)
        return object

    def _build_walls(self) -> WallsDict:
        """Builds 4 the walls of the simulation."""
        return {
            "bottom": self._add_object(
                Wall(
                    (self.left, self.bottom),
                    (self.right, self.bottom),
                    CollisionType.WALL_BOTTOM_COLLISION_TYPE,
                )
            ),
            "top": self._add_object(
                Wall(
                    (self.left, self.top),
                    (self.right, self.top),
                    CollisionType.WALL_TOP_COLLISION_TYPE,
                )
            ),
            "left": self._add_object(
                Goal(
                    (self.left, self.bottom),
                    (self.left, self.top),
                    CollisionType.GOAL_L_COLLISION_TYPE,
                )
            ),
            "right": self._add_object(
                Goal(
                    (self.right, self.bottom),
                    (self.right, self.top),
                    CollisionType.GOAL_R_COLLISION_TYPE,
                )
            ),
        }

    def _handle_goal_collision(self, win_side: Literal["left", "right"]) -> CollisionHandler:
        """Handles a goal event."""

        def handler(arbiter: pymunk.Arbiter, space: pymunk.Space, data: Any) -> bool:
            self.result = win_side
            self._make_collision_event_handler(
                CollisionType.GOAL_R_COLLISION_TYPE if win_side == "left" else CollisionType.GOAL_L_COLLISION_TYPE
            )(arbiter, space, data)

            return False

        return handler

    def _register_event_handlers(self) -> None:
        """Registers event handlers for all collisions with the ball."""
        for tpe in CollisionType:
            # ignore collisions that already have specific handlers
            if tpe not in [
                CollisionType.BAll_COLLISION_TYPE,
                CollisionType.GOAL_L_COLLISION_TYPE,
                CollisionType.GOAL_R_COLLISION_TYPE,
            ]:
                handler = self.space.add_collision_handler(
                    tpe.value, CollisionType.BAll_COLLISION_TYPE
                )
                handler.begin = self._make_collision_event_handler(
                    # Type inference is not smart enough to narrow this type based on the condition
                    cast(BallCollisionEventType, tpe)
                )

    def _apply_action(
        self, paddle: Paddle, config: PaddleConfig, action: Action, dt: float
    ) -> None:
        """Moves the paddle according to the given controller."""
        # contain the paddle within the vertical bounds
        is_pos_out_of_upper_bounds = self.top < paddle.top()
        is_pos_out_of_lower_bounds = self.bottom > paddle.bottom()
        is_pos_out_of_bounds = is_pos_out_of_upper_bounds or is_pos_out_of_lower_bounds
        is_endurance_depleted = paddle.endurance <= 0

        # move the paddle
        if action.action == "up":
            if is_endurance_depleted or is_pos_out_of_upper_bounds:
                paddle.body.velocity = 0, 0
            else:
                # velocity based
                paddle.body.velocity = 0, action.force * config.strength * 1000

                # force based
                # paddle.body.velocity = 0, paddle.body._get_velocity().y + (
                #     action.force * config.strength / 10
                # )

                # endurance is proportional to delta time
                paddle.endurance -= action.force * dt
        elif action.action == "down":
            if is_endurance_depleted or is_pos_out_of_lower_bounds:
                paddle.body.velocity = 0, 0
            else:
                # velocity based
                paddle.body.velocity = 0, -(action.force * config.strength * 1000)

                # force based
                # paddle.body.velocity = 0, paddle.body._get_velocity().y - (
                #     action.force * config.strength / 10
                # )

                # endurance is proportional to delta time
                paddle.endurance -= action.force * dt
        elif action.action == "stop":
            if is_pos_out_of_bounds:
                paddle.body.velocity = 0, 0

            # force based
            # apply friction
            # paddle.body.velocity = 0, paddle.body._get_velocity().y * (1 - 1 / 60)

            # velocity based
            paddle.body.velocity = 0, 0

            # If doing nothing, gain endurance
            # TODO: magic number for recovery
            paddle.endurance += 0.3 * dt
        else:
            print("Invalid action: ", action.action)
            assert_never(action.action)

        # contain velocity to max speed
        if abs(paddle.body._get_velocity().y) > config.max_speed:
            sign = paddle.body._get_velocity().y / abs(paddle.body._get_velocity().y)
            paddle.body.velocity = 0, (config.max_speed * sign)

        # contain endurance
        paddle.endurance = min(max(paddle.endurance, 0),
                               config.endurance)

    def _make_collision_event_handler(self, tpe: BallCollisionEventType) -> CollisionHandler:
        """Handles a collision event with the ball."""

        def handler(arbiter: pymunk.Arbiter, space: pymunk.Space, data: Any) -> bool:
            self._events.append(
                BallCollisionEvent(
                    tpe,
                    position=(
                        arbiter._get_contact_point_set().points[0].point_a.x,
                        arbiter._get_contact_point_set().points[0].point_a.y,
                    ),
                )
            )

            return True

        return handler

    def _check_bounds(self) -> None:
        """Sometimes the ball gets stuck outside the bounds of the simulation depending on dt.

        Check if the ball is out of bounds. depending on if its out of bounds from the left or right
        side, the result is set. If the ball is out of bounds from the top or bottom, the ball is
        reflected.
        """
        out_of_bounds_threshold = 40

        if self.ball.body.position.y < (self.bottom - out_of_bounds_threshold) or self.ball.body._get_position().y > (self.top + out_of_bounds_threshold):
            self.ball.body.velocity = (
                self.ball.body._get_velocity().x,
                -self.ball.body._get_velocity().y,
            )

            return None

        # Right wins if the ball is out of bounds from the left side
        if self.ball.body.position.x < (self.left - out_of_bounds_threshold):
            self.result = "right"

        # Left wins if the ball is out of bounds from the right side
        elif self.ball.body.position.x > (self.right + out_of_bounds_threshold):
            self.result = "left"

    def step(self, dt: float) -> List[SimulationEvent]:
        """Advances the simulation by the given time delta."""
        self._apply_action(self.paddle_l, self.config.paddle_l, self.controller_l.get_action(), dt)
        self._apply_action(self.paddle_r, self.config.paddle_r, self.controller_r.get_action(), dt)

        self.time += dt

        self._check_bounds()

        self.space.step(dt)

        events = self._events
        self._events = []
        return events
