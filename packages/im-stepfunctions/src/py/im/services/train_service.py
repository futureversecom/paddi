from dataclasses import dataclass

from gym.wrappers import TimeLimit
from im.services.balance import map_paddle, map_rewards
from im.services.common.configuration import ExecutionEnvironmentConfig
from im.services.memory_resolver import MemoryResolver
from im.services.opponent_resolver import OpponentResolver
from im.services.training_result_store import TrainingResultsStore
from pong.env.pong_env import EnvConfig, PongEnv
from schemas.training_output import TrainingOutput
from schemas.training_request import TrainingRequest
from stable_baselines3 import PPO


@dataclass
class Bounds:
    min: float
    max: float


def interpolate(value: float, bounds: Bounds) -> int:
    return int(bounds.min + (bounds.max - bounds.min) * value)


class TrainService:
    """This class is responsible for training the model.

    And exposes interfaces for external entrypoints to coordinate training.
    """

    def __init__(
        self,
        memory_resolver: MemoryResolver,
        training_results_store: TrainingResultsStore,
        opponent_resolver: OpponentResolver,
    ) -> None:
        self.memory_resolver = memory_resolver
        self.training_results_store = training_results_store
        self.opponent_resolver = opponent_resolver

    def _load_model(self, request: TrainingRequest, env: PongEnv) -> PPO:
        # if there is a training output, load the model from the output path
        if request.training_output is not None:
            return self.training_results_store.load_model(
                training_id=request.training_id,
                model_path=request.training_output.output_path,
            )
        else:
            return self.memory_resolver.resolve(request.player_config.memory_config, env)

    def train(
        self, request: TrainingRequest, environment_config: ExecutionEnvironmentConfig
    ) -> TrainingOutput:
        opponent_genome, opponent = self.opponent_resolver.resolve(
            request.scenario
        )

        env_config = EnvConfig(
            paddle_l=map_paddle(request.player_config.genome_attributes),
            paddle_r=map_paddle(opponent_genome),
            width=environment_config.width,
            height=environment_config.height,
            fps=environment_config.fps,
        )

        env = PongEnv(
            env_config,
            # rewards must be between 1 - 10
            map_rewards(request.reward_config, environment_config.height),
        )

        wrapped_env = TimeLimit(env, max_episode_steps=environment_config.max_episode_steps)

        agent_model = self._load_model(request, env)

        env.set_opponent(opponent)
        agent_model.set_env(wrapped_env)

        agent_model.learn(total_timesteps=environment_config.iterations_per_unit)

        output_path = self.training_results_store.store_model(agent_model, request.training_id)

        completed_training_units = (
            1
            if request.training_output is None
            else request.training_output.completed_training_units + 1
        )

        is_completed = completed_training_units == request.training_units
        return TrainingOutput(
            output_path=output_path,
            completed_training_units=completed_training_units,
            is_completed=is_completed,
        )
