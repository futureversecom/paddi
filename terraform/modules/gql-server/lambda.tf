locals {
  lambda_package_path = "../../../../packages/gql-api/dist/graphql-handler.js.zip"
}

resource "aws_s3_bucket_object" "lambda-package" {
  bucket = module.lambda_s3_bucket.s3_bucket_id
  key    = "acp-demo-gql-server-${filemd5(local.lambda_package_path)}.zip"
  source = local.lambda_package_path
}

module "gql_server_handler_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "2.36.0"

  function_name = "acp-demo-gql-server"
  handler       = "index.handler"
  timeout       = 180
  memory_size   = 512
  runtime       = "nodejs18.x"
  publish       = true

  create_package = false
  s3_existing_package = {
    bucket = aws_s3_bucket_object.lambda-package.bucket
    key    = aws_s3_bucket_object.lambda-package.id
  }

  environment_variables = {
    SENTRY_DSN         = var.sentry_dsn
    SENTRY_ENVIRONMENT = var.environment
    RPC_URL            = var.rpc_url

    ENVIRONMENT                = var.environment
    LOGIN_NONCE_TABLE_NAME     = var.tables.login_nonce.name
    TRAINING_RECORD_TABLE_NAME = var.tables.training_record.name
  }

  allowed_triggers = {
    APIGatewayAny = {
      service    = "apigateway"
      source_arn = "${module.gql_server_apigateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  create_current_version_allowed_triggers = false

  # IAM policies
  create_role                   = true
  attach_cloudwatch_logs_policy = true
  attach_policy_statements      = true

  policy_statements = {
    secretsmanager = {
      effect  = "Allow",
      actions = ["secretsmanager:GetSecretValue"],
      resources = [
        data.aws_secretsmanager_secret.acp-demo.id,
      ]
    }

    dynamodb = {
      effect  = "Allow",
      actions = ["dynamodb:*"],
      resources = [
        var.tables.login_nonce.arn,
        "${var.tables.login_nonce.arn}/index/*",
        var.tables.training_record.arn,
        "${var.tables.training_record.arn}/index/*",
      ]
    }
  }

  tags = {
    CostCenter = var.cost_center
  }
}
