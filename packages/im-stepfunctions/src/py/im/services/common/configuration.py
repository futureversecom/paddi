from dataclasses import dataclass

# Common configuration options for IM services


@dataclass
class ExecutionEnvironmentConfig:
    iterations_per_unit: int
    max_episode_steps: int
    fps = 60
    width: int = 800
    height: int = 400
    ball_radius: int = 10
    ball_init_max_speed: float = 500
    ball_init_min_speed: float = 250
    ball_init_max_angle: float = 45
