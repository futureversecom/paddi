# Functions for mapping paddle and environment config to game config
# with upper and lower bounds for game balance.

from dataclasses import dataclass

from pong.env.pong_env import PaddleConfig
from pong.env.rewards import RewardConfig
from schemas.segments.agent_config import GenomeAttributes
from schemas.training_request import RewardConfig as RequestRewardConfig


@dataclass
class Bounds:
    min: float
    max: float


def interpolate(value: float, bounds: Bounds) -> int:
    return int(bounds.min + (bounds.max - bounds.min) * value)


def map_paddle(genome_attributes: GenomeAttributes) -> PaddleConfig:
    return PaddleConfig(
        # TODO: make bounds relative to environment width/height
        width=interpolate(genome_attributes.size, Bounds(40, 150)),
        strength=interpolate(genome_attributes.strength, Bounds(10, 100)),
        max_speed=interpolate(genome_attributes.max_speed, Bounds(100, 2000)),
        endurance=interpolate(genome_attributes.endurance, Bounds(1, 5)),
    )


def map_rewards(reward_config: RequestRewardConfig, env_height: int) -> RewardConfig:
    return RewardConfig(
        win_round=reward_config.win_round * 10,
        lose_round=reward_config.lose_round * 10 * -1,
        paddle_hit=reward_config.paddle_hit * 10,
        near_miss_multiplier=reward_config.near_miss_multiplier * 10,
        near_miss_exponent=reward_config.near_miss_exponent * 10,
        # relative to environment height
        near_miss_min_distance=reward_config.near_miss_min_distance * env_height,
        survival_reward_multiplier=reward_config.survival_reward_multiplier * 10,
        endurance_penalty_multiplier=reward_config.endurance_penalty_multiplier * 10 * -1,
    )
