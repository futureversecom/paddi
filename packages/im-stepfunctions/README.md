# IM Stepfunctions

Step function and lambda implementations for running "Intelligence Mining".

## Prerequisites

- Please refer to [Python Setup](../../docs/python-setup.md) for instructions on python dev environment setup.

- Suggest installing AWS Toolkit for VSCode for visualizing step functions.

## Architecture

The project is structured in three layers.

1. [Pong Simulation](../pong-simulation/README.md) (dependency)

1. Services
   This is the application-logic layer for an entrypoint (ex: lambda) to run
   training/evaluation tasks and coordinate model loading and persistance.

1. Lambdas
   AWS Lambda entry-points for training/evaluation tasks.
