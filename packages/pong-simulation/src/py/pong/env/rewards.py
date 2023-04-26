from dataclasses import dataclass


@dataclass
class RewardConfig:
    """Reward config an agent.

    Attributes:
        win_round: reward for winning a round
        lose_round: reward for losing a round (typically negative)
        paddle_hit: reward for hitting the ball with the paddle
        near_miss_multiplier: multiplier for the near miss reward
        near_miss_exponent: we ues a power function to calculate the near miss reward
            where a closer miss is rewarded more.
        near_miss_min_distance: the minimum distance between the ball and the paddle
        survival_reward_multiplier: increased reward for surviving over time,
            1 means 1 reward per second.
        endurance_penalty_multiplier: the penalty for depleting endurance.
            more endurance used, more penalty.
    """

    win_round: float
    lose_round: float
    paddle_hit: float
    near_miss_multiplier: float
    near_miss_exponent: float
    near_miss_min_distance: float
    survival_reward_multiplier: float
    endurance_penalty_multiplier: float
