module "im-event-handler" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "2.36.0"

  function_name          = "im-event-handler"
  handler                = "index.handler"
  runtime                = "nodejs18.x"
  memory_size            = 512
  publish                = true
  maximum_retry_attempts = -1
  tracing_mode           = "Active"

  create_package         = false
  local_existing_package = "../../../../packages/event-handlers/dist/im-event-handler.js.zip"
  allowed_triggers = {
    timer = {
      principal  = "sqs.amazonaws.com"
      source_arn = var.im_events_sqs_arn
    }
  }

  environment_variables = {
    SENTRY_DSN         = var.sentry_dsn
    SENTRY_ENVIRONMENT = var.environment

    TRAINING_RECORD_TABLE_NAME = var.tables.training_record.name
  }

  event_source_mapping = {
    sqs = {
      event_source_arn = var.im_events_sqs_arn
      batch_size       = 10
    }
  }

  timeout = 30

  create_current_version_allowed_triggers = false

  # IAM policies
  create_role                   = true
  attach_cloudwatch_logs_policy = true
  attach_tracing_policy         = true
  attach_policy_statements      = true

  attach_policies    = true
  number_of_policies = 1
  policies = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole",
  ]

  policy_statements = {
    dynamodb = {
      effect  = "Allow",
      actions = ["dynamodb:*"],
      resources = [
        var.tables.training_record.arn,
        "${var.tables.training_record.arn}/index/*",
      ]
    }

  }

  tags = {
    CostCenter = var.cost_center
  }

}


