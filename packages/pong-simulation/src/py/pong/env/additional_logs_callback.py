from collections import deque
from typing import Deque, Dict

from stable_baselines3.common.callbacks import BaseCallback


class AdditionalLogsCallback(BaseCallback):
    """Custom callback for plotting additional values in tensorboard."""

    def __init__(self) -> None:
        self.rewards_buffer: Deque[Dict[str, float]] = deque(maxlen=100)
        super().__init__(verbose=0)

    def _on_step(self) -> bool:
        if self.logger is not None:
            # Log scalar value (here a random variable)
            for infos in self.locals.get("infos", []):
                # for each key in rewards, log the mean of the last 100 values
                for key, value in infos.get("rewards", {}).items():
                    self.logger.record_mean(f"rewards/{key}", value)
        return True
