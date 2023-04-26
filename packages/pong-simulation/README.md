# Pong Simulation

This is an implementation of ping-pong game described in the ASM whitepaper with
the following goals in mind.

1. Pong game to demonstrate ASM protocol
2. Validate python could be used for game and RL training
3. Simple enough project structure for Game Devs and ML Engineers to work together.
   Game devs should be able to train and configure while ML engineers could alter
   the game for their experiments.
4. Ability to run off a notebook for faster iteration, without having to depend on
   complex infrastructure.

## Prerequisites

- Please refer to [Python Setup](../../docs/python-setup.md) for instructions on python dev environment setup.

- Suggest installing AWS Toolkit for VSCode for visualizing step functions.

## Architecture

The project is structured in three layers.

1. Simulation -
   Simulation defines the core logic for running the pong game. This is not dependent
   on any rendering concerns (PyGame) or AI (no PyTorch).

   Components:

   - Core simulation
   - Simulation Config
   - Physics objects
   - Events
   - Controllers

1. Env
   This is the OpenAI Gym environment that is dependent on the Simulation. The
   Env is de-coupled on the Renderer.

   Components:

   - Core environment
   - Env Config
   - Rewards
   - Opponents

1. Renderer
   This is a light weight renderer we use during development to debug and

   Components

   - PyGame renderer
   - Pymunk debug renderer (used to debug physics objects)

   ```txt
   +-----+          +------------+          +----------+
   | Env | -------> | Simulation | <------- | Renderer |
   +-----+          +------------+          +----------+
   ```
