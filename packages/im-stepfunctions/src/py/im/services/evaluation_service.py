from gym.wrappers.time_limit import TimeLimit
from im.services.balance import map_paddle
from im.services.common.configuration import ExecutionEnvironmentConfig
from im.services.opponent_resolver import OpponentResolver
from im.services.training_result_store import S3TrainingResultsStore
from pong.env.pong_env import EnvConfig, PongEnv
from pong.env.rewards import RewardConfig
from pong.services.evaluation_runner import EvaluationRunner
from schemas.evaluation_request import EvaluationRequest


class EvaluationService:
    def __init__(
        self,
        training_result_store: S3TrainingResultsStore,
        opponent_resolver: OpponentResolver,
        evaluation_runner: EvaluationRunner,
    ) -> None:
        self._training_result_store = training_result_store
        self._opponent_resolver = opponent_resolver
        self._evaluation_runner = evaluation_runner

    # TODO: Provide the replay output path as a side effect.
    def evaluate_scenario(
        self, request: EvaluationRequest, environment_config: ExecutionEnvironmentConfig
    ) -> None:
        # load models for both agents
        model = self._training_result_store.load_model(
            training_id=request.training_id,
            model_path=request.training_output.output_path,
        )

        opponent_genome_attributes, opponent = self._opponent_resolver.resolve(
            request.evaluation.scenario
        )

        # create the environment
        env_config = EnvConfig(
            paddle_l=map_paddle(request.genome_attributes),
            paddle_r=map_paddle(opponent_genome_attributes),
            width=environment_config.width,
            height=environment_config.height,
            fps=environment_config.fps,
        )

        env = PongEnv(
            env_config,
            # The reward config is redundant here, but we need to pass it to the environment
            RewardConfig(
                win_round=1,
                lose_round=1,
                paddle_hit=1,
                near_miss_multiplier=1,
                near_miss_exponent=1,
                near_miss_min_distance=1,
                survival_reward_multiplier=1,
                endurance_penalty_multiplier=1,
            ),
        )

        wrapped_env = TimeLimit(env, max_episode_steps=environment_config.max_episode_steps)

        env.set_opponent(opponent)
        env.disable_training()
        model.set_env(wrapped_env)

        # run the evaluation
        self._evaluation_runner.evaluate(
            model, wrapped_env, env.simulation.config, request.evaluation.iterations)
