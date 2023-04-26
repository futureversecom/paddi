from dataclasses import dataclass
from typing import Literal

ActionType = Literal["up", "down", "stop"]


@dataclass
class Action:
    action: ActionType
    # Force magnitude between 0 and 1
    force: float


class Controller:
    """An abstract controller interface to be implemented by any kind of an agent."""

    def get_action(self) -> Action:
        raise NotImplementedError("To be implemented by subclass.")
