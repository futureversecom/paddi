# Local GraphQL server Setup

For all aws services, only graphql server can be run locally.

## Pre-Requisites

- Install [Docker](https://www.docker.com/products/docker-desktop/)

- Install the [AWS CLI](https://aws.amazon.com/cli/).

  - Verify that the AWS CLI is installed by running `aws` in a terminal window.

## Local AWS setup

- Set up [AWS Shared Credential File](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

  - Your `~/.aws/credentials` (`%UserProfile%\.aws\credentials` on Windows) should look like the following:

    ```ini
    [default]
    aws_access_key_id = local
    aws_secret_access_key = local
    ```

  - Your `~/.aws/config` (`%UserProfile%\.aws\config` on Windows) should look like the following:

    ```ini
    [default]
    region = us-west-2
    ```

## Start the local AWS environment

1. Create a local tfvars file and define secret_value

```sh
touch ./terraform/local/local.auto.tfvars
```

2. Run docker

```sh
docker compose up -d
```

### Applying terraform changes locally

```sh
docker compose up terraform-local
```
