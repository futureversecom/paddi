import pygame
from pong.interactive_game import InteractiveGame
from pong.renderer.pygame_renderer import PygameRenderer

pygame.init()

width = 800
height = 400
fps = 60

renderer = PygameRenderer(width, height, fps)
game = InteractiveGame(renderer, width, height, fps)

game.run_game_loop()

pygame.quit()
