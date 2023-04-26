module "consumer_lag_reporter" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "2.36.0"

  function_name          = "training-request-handler"
  handler                = "index.handler"
  runtime                = "nodejs18.x"
  memory_size            = 512
  publish                = true
  maximum_retry_attempts = -1
  tracing_mode           = "Active"

  create_package         = false
  local_existing_package = "../../../../packages/event-handlers/dist/training-event-handler.js.zip"
  allowed_triggers = {
    timer = {
      principal  = "sqs.amazonaws.com"
      source_arn = aws_sqs_queue.consumer-queue.arn
    }
  }

  environment_variables = {
    SENTRY_DSN         = var.sentry_dsn
    SENTRY_ENVIRONMENT = var.environment

    TRAINING_RECORD_TABLE_NAME = var.tables.training_record.name
    STEP_FUNCTION_ARN          = var.step_function_arn
    IM_RESULTS_DOMAIN_NAME     = var.im_results_domain_name
  }

  event_source_mapping = {
    sqs = {
      event_source_arn = aws_sqs_queue.consumer-queue.arn
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

    stepfunction = {
      sid       = "stepfunctionPermission"
      effect    = "Allow"
      resources = [var.step_function_arn]
      actions = [
        "states:StartExecution"
      ]
    }
  }

  tags = {
    CostCenter = var.cost_center
  }

}


