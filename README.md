# ASM-Core-Protocol (ACP) Demo

## Development Environment

- [Javascript Setup](docs/js-setup.md)
- [Python Setup](docs/python-setup.md)
- [Local GraphQL Server Setup](docs/local-gql-setup.md)

## sync.js

Run this node script to create a list of files we want to sync to the Open Source repo

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
