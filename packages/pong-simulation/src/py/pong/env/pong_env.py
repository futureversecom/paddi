from dataclasses import dataclass
from typing import Any, Dict, List, Tuple

import gym
import numpy as np
import pong.simulation.config as simulation_config
from pong.env.opponent import Opponent
from pong.env.rewards import RewardConfig
from pong.env.spaces import (
    Action,
    ActionSpace,
    ActionType,
    InfoType,
    ObsSpace,
    ObsType,
    transform_raw_action,
)
from pong.renderer.render_state import render_state_from_simulation_state
from pong.simulation.events import BallCollisionEvent, SimulationEvent
from pong.simulation.physics_objects import CollisionType
from pong.simulation.simulation import PongSimulation
from pong.simulation.state_defined_controller import StateDefinedController
from typing_extensions import assert_never


@dataclass
class PaddleConfig:
    width: int
    strength: int
    max_speed: int
    endurance: int


@dataclass
class BallConfig:
    radius: int = 10
    init_max_speed: int = 1000
    init_min_speed: int = 250
    init_max_angle: int = 30


@dataclass
class EnvConfig:
    paddle_l: PaddleConfig
    paddle_r: PaddleConfig
    width: int = 800
    height: int = 400
    fps: int = 60
    action_fps: int = 60
    ball_config = BallConfig()


class PongEnv(gym.Env):  # type: ignore
    def __init__(self, config: EnvConfig, reward_config: RewardConfig, is_training: bool = True):
        self.config = config
        self.width = config.width
        self.height = config.height
        self.fps = config.fps
        self.action_fps = config.action_fps
        self.reward_config = reward_config
        self.is_training = is_training

        self.metadata = {"render_modes": ["ansi"], "render_fps": [str(self.fps)]}

        self.controller_l = StateDefinedController()
        self.controller_r = StateDefinedController()
        self.simulation = self._make_simulation()

        self.observation_space = ObsSpace

        self.action_space = ActionSpace
        self.last_step_events: List[SimulationEvent] = []

    def set_opponent(self, opponent: Opponent) -> None:
        """Sets the opponent agent model."""
        self.opponent = opponent

    def set_reward_config(self, reward_config: RewardConfig) -> None:
        """Re-Sets the reward configuration."""
        self.reward_config = reward_config

    def enable_training(self) -> None:
        """Sets the training mode."""
        self.is_training = True

    def disable_training(self) -> None:
        """Sets the evaluation mode."""
        self.is_training = False

    def _make_simulation(self) -> PongSimulation:
        """Creates a new simulation with random initial ball velocity."""
        init_velocity = np.random.random_integers(
            self.config.ball_config.init_min_speed,
            self.config.ball_config.init_max_speed,
        )
        init_angle = np.random.random_integers(0, self.config.ball_config.init_max_angle)

        # always serve to the agent during training
        init_velocity_x = init_velocity * np.cos(np.deg2rad(init_angle)) * (-1 if self.is_training else np.random.choice([1, -1]))
        init_velocity_y = init_velocity * np.sin(np.deg2rad(init_angle)) * np.random.choice([1, -1])

        return PongSimulation(
            simulation_config.SimulationConfig(
                width=self.config.width,
                height=self.config.height,
                ball=simulation_config.BallConfig(
                    radius=10,
                    init_velocity=(init_velocity_x, init_velocity_y),
                ),
                paddle_l=simulation_config.PaddleConfig(
                    width=self.config.paddle_l.width,
                    strength=self.config.paddle_l.max_speed,
                    endurance=self.config.paddle_l.endurance,
                    max_speed=self.config.paddle_l.max_speed,
                ),
                paddle_r=simulation_config.PaddleConfig(
                    width=self.config.paddle_r.width,
                    strength=self.config.paddle_r.max_speed,
                    endurance=self.config.paddle_r.endurance,
                    max_speed=self.config.paddle_r.max_speed,
                ),
                controller_l=self.controller_l,
                controller_r=self.controller_r,
            )
        )

    def _normalize_x_coordinate(self, x: float, is_opponent: bool) -> float:
        """Agents learn/predicts from one side of the ping pong table.

        This allows us to normalize the x coordinate to be from the perspective of the agent.
        """
        return self.width - x if is_opponent else x

    def _get_obs(self, is_opponent: bool = False) -> ObsType:
        """Create observations from the state of the simulation."""
        paddle_l_top = self.simulation.paddle_l.top() / self.height
        paddle_l_bottom = self.simulation.paddle_l.bottom() / self.height
        paddle_r_top = self.simulation.paddle_r.top() / self.height
        paddle_r_bottom = self.simulation.paddle_r.bottom() / self.height

        paddle_velocity_l = (
            self.simulation.paddle_l.body.velocity.y / self.config.paddle_l.max_speed
        )
        paddle_velocity_r = (
            self.simulation.paddle_r.body.velocity.y / self.config.paddle_r.max_speed
        )

        paddle_endurance_l = self.simulation.paddle_l.endurance / self.config.paddle_l.endurance
        paddle_endurance_r = self.simulation.paddle_r.endurance / self.config.paddle_r.endurance

        ball_distance_x = abs(
            self.simulation.ball.body._get_position().x - self.simulation.paddle_r.body._get_position().x
        ) / self.width

        ball_distance_y = (
            self.simulation.ball.body._get_position().y - self.simulation.paddle_r.body._get_position().y
        ) / self.height

        time = self.simulation.time

        return {
            "paddle_l_top": np.array([paddle_r_top if is_opponent else paddle_l_top]),
            "paddle_l_bottom": np.array([paddle_r_bottom if is_opponent else paddle_l_bottom]),
            "paddle_r_top": np.array([paddle_l_top if is_opponent else paddle_r_top]),
            "paddle_r_bottom": np.array([paddle_l_bottom if is_opponent else paddle_r_bottom]),
            "paddle_velocity_l": np.array(
                [paddle_velocity_r if is_opponent else paddle_velocity_l]
            ),
            "paddle_velocity_r": np.array(
                [paddle_velocity_l if is_opponent else paddle_velocity_r]
            ),
            "paddle_endurance_l": np.array(
                [paddle_endurance_r if is_opponent else paddle_endurance_l]
            ),
            "paddle_endurance_r": np.array(
                [paddle_endurance_l if is_opponent else paddle_endurance_r]
            ),
            "ball_distance_x": np.array([ball_distance_x]),
            "ball_distance_y": np.array([ball_distance_y]),
            "ball": np.array(
                [
                    self._normalize_x_coordinate(self.simulation.ball.body.position.x, is_opponent),
                    self.simulation.ball.body.position.y,
                ],
            ),
            "ball_velocity": np.array(
                [
                    self.simulation.ball.body.velocity.x * (-1 if is_opponent else 1),
                    self.simulation.ball.body.velocity.y,
                ]
            ),
            "time": np.array([time]),
        }

    def reset(self) -> ObsType:
        self.simulation = self._make_simulation()
        return self._get_obs()

    def _move_paddle(self, controller: StateDefinedController, action: Action) -> None:
        if action.action is ActionType.UP:
            controller.set_model_action("up", action.force)
        elif action.action is ActionType.DOWN:
            controller.set_model_action("down", action.force)
        elif action.action is ActionType.STOP:
            controller.set_model_action("stop", action.force)
        else:
            print("Invalid action: ", action)
            assert_never(action.action)

    def _calculate_paddle_hit_reward(self, events: List[SimulationEvent]) -> float:
        reward = 0.0
        for event in events:
            if isinstance(event, BallCollisionEvent):
                if event.collision_type == CollisionType.PADDLE_L_COLLISION_TYPE:
                    reward += self.reward_config.paddle_hit
                elif event.collision_type == CollisionType.PADDLE_R_COLLISION_TYPE:
                    reward += 0

        return reward

    def _calculate_near_miss_reward(self) -> float:
        if self.simulation.result is None or self.simulation.result == "left":
            return 0.0

        ball_paddle_distance = min(
            abs(
                self.simulation.ball.body._get_position().y - self.simulation.paddle_l.top()
            ),
            abs(
                self.simulation.ball.body._get_position().y - self.simulation.paddle_l.bottom()
            ),
        )

        if ball_paddle_distance > self.reward_config.near_miss_min_distance:
            return 0.0

        normalized: float = pow(
            (self.height - ball_paddle_distance) / self.height,
            self.reward_config.near_miss_exponent,
        )

        return normalized * self.reward_config.near_miss_multiplier

    def _calculate_round_result_reward(self) -> float:
        if self.simulation.result == "left":
            return self.reward_config.win_round
        elif self.simulation.result == "right":
            return self.reward_config.lose_round
        else:
            return 0.0

    def _calculate_endurance_reward(self) -> float:
        """This is a continuous reward that applies over each frame.

        we apply `endurance_penalty_multiplier` per second so this is bounded.
        """
        depleted_endurance_percentage = (self.simulation.config.paddle_l.endurance - self.simulation.paddle_l.endurance) / \
            self.simulation.config.paddle_l.endurance

        return (self.reward_config.endurance_penalty_multiplier / self.config.fps) * pow(depleted_endurance_percentage, 3)

    def _calculate_survival_reward(self) -> float:
        """Rewarded at the end of a round for how long the agent survived."""
        if self.simulation.result is None:
            return 0.0

        return self.reward_config.survival_reward_multiplier * self.simulation.time / 10

    def _calculate_rewards(self, events: List[SimulationEvent]) -> Dict[str, float]:
        return {
            "round_result": self._calculate_round_result_reward(),
            "paddle_hit": self._calculate_paddle_hit_reward(events),
            "near_miss": self._calculate_near_miss_reward(),
            "endurance": self._calculate_endurance_reward(),
            "survival": self._calculate_survival_reward(),
        }

    def step(self, action: Any) -> Tuple[ObsType, float, bool, InfoType]:
        """The action is a flattened array that needs to be unflattened using the Dict space."""
        # run opponent's action, the opponent always control the right paddle
        # the observations are normalized to the perspective of the opponent agent (left)
        # the action is transformed to the perspective of the opponent paddle (right)
        opponent_obs = self._get_obs(is_opponent=True)

        opponent_action = self.opponent.predict(observation=opponent_obs)

        self._move_paddle(self.controller_l, transform_raw_action(action))
        self._move_paddle(self.controller_r, opponent_action)

        # run simulation with a smaller dt to avoid skipping collisions
        events = []
        render_states = []

        # we take action every `action_fps``, but simulate on `fps`. action_fps is a fraction of fps.
        for i in range(self.fps // self.action_fps):
            # we need to run the simulation with a higher resolution compared to the render to
            # avoid physics glitches
            for _ in range(10):
                events += self.simulation.step(1 / self.fps / 10)

            # record states that aligns to render_fps
            if i % 1 == 0:
                render_states.append(render_state_from_simulation_state(self.simulation))

        rewards = self._calculate_rewards(events)
        total_reward = sum(rewards.values())
        self.last_step_events = events

        done = self.simulation.result is not None
        info: InfoType = {
            "events": events,
            "states": render_states,
            "result": self.simulation.result,
            "rewards": rewards,
            "is_success": self.simulation.result == "left" if self.simulation.result is not None else None,
        }

        return self._get_obs(), total_reward, done, info

    def render(self, mode: str = "human") -> None:
        """Render concerns are decoupled from RL concerns."""
        pass
