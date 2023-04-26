import pong.simulation.config as simulation_config
import pygame
from pong.simulation.keyboard_controller import ArrowKeyMapping, KeyboardController
from pong.simulation.simulation import PongSimulation
from pymunk.pygame_util import DrawOptions

width = 800
height = 400
fps = 60

pygame.init()
clock = pygame.time.Clock()
screen = pygame.display.set_mode((width, height))

screen.fill((255, 255, 255))

# pygame seem to export two different surface types
draw_options = DrawOptions(screen)  # type: ignore

simulation = PongSimulation(
    simulation_config.SimulationConfig(
        width=width,
        height=height,
        ball=simulation_config.BallConfig(
            radius=10,
            init_velocity=(1000, 1000),
        ),
        paddle_l=simulation_config.PaddleConfig(
            width=40, strength=1000, endurance=10, max_speed=1000
        ),
        paddle_r=simulation_config.PaddleConfig(
            width=1000, strength=1000, endurance=10, max_speed=1000
        ),
        controller_l=KeyboardController(ArrowKeyMapping),
        controller_r=KeyboardController(ArrowKeyMapping),
    )
)

while True:
    simulation.step(1 / 60)
    simulation.space.debug_draw(draw_options)
    clock.tick(30)
    pygame.display.update()


# pygame.quit()
