# ASM-Core-Protocol (ACP) Demo

Welcome to the open-source repository for Paddi, powered by Altered State Machine Protocol and The Root Network. Our mission is to make it easy for developers to start with Paddi, extend the game and showcase what’s possible. Success for us means the community & game studios are using this demo to build their own experiences and learn.

This monorepo contains everything that is needed to build a gamified AI experience, run intelligence mining at scale via smart-contracts and AWS infrastructure and render that in a game engine. The only missing component from the repo is chain-sync service, which is an internal service similar to [Alchemy Webhooks](https://www.alchemy.com/overviews/what-is-a-webhook) that is used to listen to contract events.

## Purpose of repo

In mid-May 2023, we launched Paddi to the community as an open-source project on GitHub. We have created this landing page to make it easy for developers to understand the project, see a high-level view of all the components, and access them easily.

## About Paddi

Paddi is like a classic table tennis video game that people of all ages have enjoyed for decades.

- This version has ASM Brains which power the paddles. Each Brain brings diverse attributes, so no two paddles are the same. We have included speed, strength, endurance & size in this example.
- Paddi demonstrates the ASM Core Protocol, which facilitates AI/ML training payments with ASTO and provides Memory Trees that hold AI models from training.
- Paddi demonstrates how AI training can be incorporated into games using reinforcement learning algorithms and open-source Python libraries. We don’t show everything possible but just enough to spark your creativity. We also show examples of extending this further, so check out the examples section for this.

## Components

The open-source repository for Paddi includes the following components:

- [Pong Simulation](packages/pong-simulation/README.md) Reinforcement Learning to teach a paddle to play Paddi
- [Replay - 3d](packages/replay-component) ThreeJs based replay engine for interpreting what happened during a simulation.
- [Replay - 2d](packages/replay-component-2d) VanillaJS based replay engine for interpreting what happened during a simulation.
- [Smart Contracts](packages/smart-contracts/README.md) Smart contracts extending the ASM Core Protocol.
- [Schemas](packages/schemas/README.md) Json schema definitions for replay events and internal intelligence mining events.
- [IM Stepfunctions](packages/im-stepfunctions/README.md) The Intelligence Mining service layer logic and step function definitions.
- [Web App](packages/web-app/README.md) React.js based web experience for Paddi.
- [GraphQL Api and `core`, `core-backend`, `event-handlers`](packages/gql-api/README.md) The backend Apis, event handlers, types and common packages.
- `Terraform` Scalable AWS Infrastructure as code for Paddi.

## Getting Started

To start working with Paddi, you can clone the repository from GitHub and follow the README instructions. You can also find examples of extending the code in our documentation.

## Packages

## Development Environment

- [Javascript Setup](docs/js-setup.md)
- [Python Setup](docs/python-setup.md)
- [Local GraphQL Server Setup](docs/local-gql-setup.md)

## sync.js

Run this node script to update the list of files we want to sync to the Open Source repo via Github Actions.
`node .github/scripts/sync.js`

## Generate env files

- Create `.env` file
  - `cp packages/web-app/.env.example packages/web-app/.env`
  - Assign values in the `.env` file accordingly.
- Generate ENDPOINT env from terraform if you don't know your endpoint.
  - Install awscli
    - `brew install awscli`
  - Install aws-vault and terraform
    - `brew install terraform; brew install --cask aws-vault`
  - Setup your aws profile follow steps from [aws-vault quick start](https://github.com/99designs/aws-vault#quick-start) or `aws configure sso` if you are using SSO.
  - `cd terraform/dev/us-west-2/stack`
  - `aws-vault exec your_aws_profile_name -- terraform apply -target=null_resource.env_file`

## Retrieve git submodules

(There might be a better way not depending on foundry)

### Using https with Git Submodules

1. Set https urls in `.gitmodules`
2. Run `git submodules sync` to sync the urls with current state
3. Run `git submodule update --init --recursive` to update the submodules

### Pre-requisites

- [foundry](https://book.getfoundry.sh/getting-started/installation) must be installed

```sh
yarn workspace smart-contracts forge:install
```

## Run the services

- Run local **gql-server** (<http://localhost:4000>)

  ```sh
  yarn workspace gql-api start:dev
  ```

- Run **web-app**

  ```sh
  yarn workspace web-app dev
  ```

- Run **replay-component**

  ```sh
  yarn workspace replay-component dev
  ```

## Code Generation

### Client

- Add query/mutation GraphQl Documents under [operations](packages/web-app/src/graphql/operations)
- `yarn workspace web-app gql:codegen`

## Infrastructure

### Build Cache

Building the cached image on a schedule presents several problems and we need to take special care when making updates to the cached image itself.

- The changes to the `build-cache.Docker` file needs to be made in a separate PR from its dependencies and merged to main for the changes to take effect.

- For breaking changes the version of the build image needs to be incremented in the following files (build-cache-${version})

  1. docker-compose.yml
  2. build.Dockerfile
  3. .buildkite/build-cache.yaml

- The build needs to be manually triggered from the Buildkite interface
  <https://buildkite.com/futureverse/acp-demo-build-cache>

- To test changes to this docker image in CI during development, you could specify a test version build-cache-${'test-feature-xyz'}, and update the relevant files. Then kick off a build in the development branch via the Buildkite interface
