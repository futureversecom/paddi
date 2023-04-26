provider "aws" {
  access_key = "test"
  secret_key = "test"

  region = "us-west-2"

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  skip_region_validation      = true

  endpoints {
    apigateway     = "http://localstack-main:4566"
    cloudformation = "http://localstack-main:4566"
    cloudwatch     = "http://localstack-main:4566"
    dynamodb       = "http://localstack-main:4566"
    ec2            = "http://localstack-main:4566"
    elasticache    = "http://localstack-main:4566"
    es             = "http://localstack-main:4566"
    firehose       = "http://localstack-main:4566"
    iam            = "http://localstack-main:4566"
    kinesis        = "http://localstack-main:4566"
    lambda         = "http://localstack-main:4566"
    rds            = "http://localstack-main:4566"
    redshift       = "http://localstack-main:4566"
    route53        = "http://localstack-main:4566"
    s3             = "http://localstack-main:4566"
    secretsmanager = "http://localstack-main:4566"
    ses            = "http://localstack-main:4566"
    sns            = "http://localstack-main:4566"
    sqs            = "http://localstack-main:4566"
    ssm            = "http://localstack-main:4566"
    stepfunctions  = "http://localstack-main:4566"
    sts            = "http://localstack-main:4566"
  }
}
