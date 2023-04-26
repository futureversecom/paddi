# Python Development Setup

The ACP-demo consists of multiple Python modules, mainly on the Intelligence Mining domain.

**We use [Pants](https://www.pantsbuild.org/) build-system to:**

- Manage dependencies accross 3rd party modules and internal modules.
- Cache dependencies.
- Packaging for Lambdas.
- Run tasks for linting, building, etc...
- Managing Virtual Environments.

## Pre-Requisites

1. PyEnv:
   PyEnv manages the python version for the repo. The `.python-version` file in the root of the repo instructs PyEnv to use the Python 3.8 version.

   - Follow <https://github.com/pyenv/pyenv#installation> for installation instructions.
   - Install the required version of python `pyenv install 3.8.

1. Pants:
   Follow <https://www.pantsbuild.org/docs/installation> for installation instructions for Pants

## Setup

1. Initialize Pants in the repository by running `pants --version`. This will install the required packages and setup the repository.

## Virtual Env

Pants has a utility for exporting and managing a virtual env for local development and IDE setup.

1. Pants creates a virtual env under the hood on a obfuscated path specific to the project and OS. The following command allows the venv to get symlinked from the repository.

   Run `pants venv` to export dependencies to a venv.

1. To setup VSCode to use venv interpreter run `> Python: Select Interpreter` in the command pallet. Then select `dist/export/python/virtualenvs/python-default/3.8.16/bin/python`

1. To run the `venv` from CLI, execute `source dist/export/python/virtualenvs/python-default/3.8.16/bin/activate`

## Installing new dependencies

1. Add dependency to <../pants/3rdparty/requirements.txt> and update the lockfiles using `pants update-locks`

1. Re export the venv running `pants venv` if needed.
