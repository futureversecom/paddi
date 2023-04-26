FROM public.ecr.aws/lambda/python:3.8

# Install CI dependencies
RUN yum install -y git

# Install pants
ENV PATH="$PATH:~/bin"
RUN curl --proto '=https' --tlsv1.2 -fsSL  https://static.pantsbuild.org/setup/get-pants.sh | bash

WORKDIR /app

ENV PANTS_CONFIG_FILES=pants.ci.toml

# Copy on the the pants/python related files
# pands depend on .git repository for diffing
ADD .git .git
ADD pants.toml pants.ci.toml BUILD .flake8 mypy.ini pyproject.toml ./
ADD pants/3rdparty pants/3rdparty
ADD packages/pong-simulation packages/pong-simulation
ADD packages/im-stepfunctions packages/im-stepfunctions
ADD packages/schemas packages/schemas

# initialise pants
RUN pants --version
