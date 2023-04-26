from typing import Dict, List, Literal, Optional, Tuple

import pygame
from pong.renderer.render_state import Ball, Paddle, RenderState
from pong.renderer.renderer import Renderer
from pong.simulation.config import SimulationConfig
from pong.simulation.events import SimulationEvent
from pong.simulation.simulation import ResultType


class PygameRenderer(Renderer):
    def __init__(self, width: int, height: int, fps: int):
        self.width = width
        self.height = height
        self.fps = fps

        self.top = height - 1
        self.bottom = 0
        self.right = width - 1
        self.left = 0
        self.middle_x = int(width / 2)
        self.middle_y = int(height / 2)
        self.surface: Optional[pygame.surface.Surface] = None
        self.clock = pygame.time.Clock()
        self.cumulative_reward: Dict[str, float] = {}
        self.rewards: List[Dict[str, float]] = []
        self.score = (0, 0)

    def get_surface(self) -> pygame.surface.Surface:
        if self.surface is None:
            pygame.init()
            self.font = pygame.font.SysFont(pygame.font.get_fonts()[0], 12)
            self.surface = pygame.display.set_mode((self.width, self.height))
        return self.surface

    def _convert_coordinates(self, point: Tuple[float, float]) -> Tuple[int, int]:
        return int(point[0]), int((self.height - 1) - point[1])

    def _render_paddle(self, paddle: Paddle) -> None:
        p1 = (paddle.position[0], paddle.position[1] - paddle.width / 2)
        p2 = (paddle.position[0], paddle.position[1] + paddle.width / 2)

        pygame.draw.line(
            self.get_surface(), [255, 0, 0], self._convert_coordinates(
                p1), self._convert_coordinates(p2), 4)

    def _render_endurance(
        self, state: Paddle, max_endurance: int, side: Literal["left", "right"]
    ) -> None:
        length = 100
        height = 20
        outer_margin = 20
        left = outer_margin if side == "left" else self.width - length - outer_margin
        top = outer_margin

        pygame.draw.rect(self.get_surface(), 'gray', pygame.Rect(
            left, top, length, height)
        )

        pygame.draw.rect(self.get_surface(), 'red', pygame.Rect(
            left, top, length * state.endurance / max_endurance, height)
        )

    def _render_ball(self, state: Ball) -> None:
        pygame.draw.circle(
            self.get_surface(), [0, 0, 0], self._convert_coordinates(state.position), state.radius)

    def _render_rewards(self, rewards: Dict[str, float]) -> None:
        self.cumulative_reward = {
            key: self.cumulative_reward.get(key, 0) + value for key, value in rewards.items()
        }

        # append to a copy of rewards
        combined = self.rewards.copy()
        combined.append(self.cumulative_reward)
        combined = combined[-3:]
        line = 0

        # iterate combined in reverse order
        for reward in reversed(combined):
            for (key, value) in reward.items():
                text = f"{key}:  ${value}"
                img = self.font.render(text, True, "BLACK")
                self.get_surface().blit(img, (100, 100 + line * 15))
                line += 1

    def _render_ruler_y(self) -> None:
        for y in range(0, self.height, 10):
            pygame.draw.line(self.get_surface(), (0, 0, 0), (0, y), (50, y), 1)

            if y % 2 == 0:
                img = self.font.render(str(y + 10), True, (0, 0, 0))
                self.get_surface().blit(img, (10, y - 5))

    def render_turn_end(self, turn_index: int, result: Optional[ResultType]) -> None:
        super().render_turn_end(turn_index, result)

        if result == "left":
            self.score = (self.score[0] + 1, self.score[1])
        elif result == "right":
            self.score = (self.score[0], self.score[1] + 1)

        self.rewards.append(self.cumulative_reward)
        self.cumulative_reward = {}

    def render(self,
               state: RenderState,
               events: List[SimulationEvent],
               rewards: Dict[str, float],
               config: SimulationConfig,
               frame_index: int) -> None:
        self.get_surface().fill((255, 255, 255))
        self._render_ball(state.ball)

        self._render_paddle(state.paddle_l)
        self._render_paddle(state.paddle_r)
        self._render_endurance(state.paddle_l, state.paddle_l.max_endurance, "left")
        self._render_endurance(state.paddle_r, state.paddle_r.max_endurance, "right")
        self._render_rewards(rewards)
        # self._render_ruler_y()
        # for wall in self.walls:
        #     wall.draw(self.display)

        # draw middle line
        pygame.draw.line(self.get_surface(), (0, 0, 0), (self.middle_x,
                         self.bottom), (self.middle_x, self.top), 1)
        score_text = self.font.render(
            f"{self.score[0]} - {self.score[1]}", True, (0, 0, 0))
        self.get_surface().blit(score_text, (self.middle_x - score_text.get_rect().width / 2, self.top - 10))

        pygame.display.update()
        self.clock.tick(self.fps)
