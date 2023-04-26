from dataclasses import dataclass
from typing import Optional, Tuple, cast

import gym
import numpy as np
from pong.env.pong_env import PongEnv
from pong.env.spaces import InfoType
from pong.renderer.renderer import Renderer
from pong.simulation.config import SimulationConfig
from pong.simulation.simulation import ResultType
from stable_baselines3 import PPO


@dataclass
class WrappedEnv:
    env: gym.Env
    underlying: PongEnv


class EvaluationRunner:
    def __init__(self, renderer: Renderer) -> None:
        self._renderer = renderer

    def evaluate(
        self,
        model: PPO,
        env: gym.Env,
        config: SimulationConfig,
        iterations: int,
    ) -> Tuple[float, float]:
        episode_rewards = []

        # render the start of the game, in case of events output, this emits a HeaderEvent
        self._renderer.render_game_start(config)

        for i in range(iterations):
            observations = env.reset()

            # render the start of a turn, in case of events output, this emits a TurnStartEvent
            self._renderer.render_turn_start(turn_index=i)

            done = False
            current_reward = 0

            frame_index = 0
            result: Optional[ResultType] = None
            while not done:
                # Pyright (used by VSCode) doesn't seem to work with the types here, but mypy passes.
                action, _states = model.predict(
                    observations)  # pyright: ignore

                observations, reward, done, info = env.step(action)
                # the returned info type from the wrapped env does not have this
                info = cast(InfoType, info)

                current_reward += reward

                # Render the current state of the simulation, via the environment
                for state in info["states"]:
                    self._renderer.render(
                        state, info['events'], info['rewards'], config, frame_index)

                frame_index += 1

                result = info["result"]

            episode_rewards.append(current_reward)

            # render the end of a turn, in case of events output, this emits a TurnEndEvent
            self._renderer.render_turn_end(
                turn_index=i, result=result)

        # render the end of the game, in case of events output, this emits a FooterEvent
        self._renderer.render_game_end()

        mean_reward = np.mean(episode_rewards)
        std_reward = np.std(episode_rewards)

        return float(mean_reward), float(std_reward)
