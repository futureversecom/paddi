from dataclasses import dataclass
from typing import Optional

import pygame
from pong.simulation.controller import Action, Controller


@dataclass
class KeyMapping:
    """key mapping config for keyboard controller."""

    up: int
    down: int


ArrowKeyMapping = KeyMapping(pygame.K_UP, pygame.K_DOWN)
WASDKeyMapping = KeyMapping(pygame.K_w, pygame.K_s)

ACTION_FRAMES = 1


class KeyboardController(Controller):
    action: Action

    def __init__(self, config: KeyMapping):
        self.action = Action("stop", 1.0)
        self.config = config
        self.frames = 0
        self.last_action: Optional[Action] = None

    # for ACTION_FRAMES of these keep the same
    def get_action(self) -> Action:
        keys = pygame.key.get_pressed()

        if keys[self.config.up]:
            self.frames = ACTION_FRAMES
            self.last_action = Action("up", 1.0)
            return self.last_action
        elif keys[self.config.down]:
            self.frames = ACTION_FRAMES
            self.last_action = Action("down", 1.0)
            return self.last_action
        else:
            if self.last_action is not None and self.frames > 0:
                self.frames -= 1
                return self.last_action
            else:
                self.last_action = Action("stop", 0.0)

            return self.last_action
