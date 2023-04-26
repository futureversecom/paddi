from typing import Literal

import numpy as np
import pong.simulation.config as simulation_config
import pygame
from pong.renderer.render_state import render_state_from_simulation_state
from pong.renderer.renderer import Renderer
from pong.simulation.keyboard_controller import ArrowKeyMapping, KeyboardController, WASDKeyMapping
from pong.simulation.simulation import PongSimulation


class InteractiveGame:
    def __init__(
        self,
        renderer: Renderer,
        width: int = 800,
        height: int = 400,
        fps: int = 60,
    ):
        self.score = [0, 0]
        self.renderer = renderer
        self.width = width
        self.height = height
        self.fps = fps

        self.controller_l = KeyboardController(WASDKeyMapping)
        self.controller_r = KeyboardController(ArrowKeyMapping)
        self._reset()

    def _reset(self) -> None:
        self.simulation = self._make_simulation()

    def _make_simulation(self) -> PongSimulation:
        return PongSimulation(
            simulation_config.SimulationConfig(
                width=self.width,
                height=self.height,
                ball=simulation_config.BallConfig(
                    radius=10,
                    init_velocity=(
                        np.random.random_integers(250, 500) * np.random.choice([1, -1]),
                        np.random.random_integers(250, 500) * np.random.choice([1, -1]),
                    ),
                ),
                paddle_l=simulation_config.PaddleConfig(width=150, strength=10, endurance=2, max_speed=200,),
                paddle_r=simulation_config.PaddleConfig(
                    width=400,
                    strength=10,
                    endurance=100,
                    max_speed=100,
                ),
                controller_l=self.controller_l,
                controller_r=self.controller_r,
            )
        )

    def _step(self) -> bool:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False

        events = []
        for _ in range(10):
            events += self.simulation.step(0.1 / self.fps)

        self.renderer.render(
            render_state_from_simulation_state(self.simulation), events, {}, self.simulation.config, 0)

        return True

    def _run_turn_loop(self) -> Literal["quit", "left", "right"]:
        while self._step():
            if self.simulation.result:
                return self.simulation.result

        return "quit"

    def run_game_loop(self) -> None:
        while True:
            result = self._run_turn_loop()

            if result == "quit":
                return
            elif result == "left":
                self._reset()
                self.score = [self.score[0] + 1, self.score[1]]
            elif result == "right":
                self._reset()
                self.score = [self.score[0], self.score[1] + 1]
