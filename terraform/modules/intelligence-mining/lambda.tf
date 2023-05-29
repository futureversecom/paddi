module "training_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "4.10.1"

  function_name = "acp-demo-im-training"
  description   = "Training lambda for intelligence mining"

  create_package = false

  timeout = 15 * 60

  # while this could run with 1024, we get 6 vcpus with 10240
  # where the training could be parallelized
  # https://www.sentiatechblog.com/aws-re-invent-2020-day-3-optimizing-lambda-cost-with-multi-threading?utm_source=reddit&utm_medium=social&utm_campaign=day3_lambda
  memory_size   = 10240
  architectures = ["x86_64"]

  environment_variables = {
    SENTRY_DSN                   = var.sentry_dsn
    SENTRY_ENVIRONMENT           = var.environment
    ACP_DEMO_RESULTS_BUCKET      = aws_s3_bucket.results-bucket.id
    ACP_DEMO_ITERATIONS_PER_UNIT = 25000
  }

  attach_policy_statements = true
  policy_statements = {
    s3-list = {
      effect  = "Allow",
      actions = ["s3:ListBucket"],
      resources = [
        aws_s3_bucket.results-bucket.arn,
      ]
    }

    s3-read-write = {
      effect  = "Allow",
      actions = ["s3:*Object"],
      resources = [
        "${aws_s3_bucket.results-bucket.arn}/*",
      ]
    }
  }

  # Container Image
  image_uri            = "${data.aws_ecr_repository.im.repository_url}@${data.aws_ecr_image.im-lambda-training.image_digest}"
  package_type         = "Image"
  image_config_command = ["lambdex_handler.handler"]
}

module "evaluation_config_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "4.10.1"

  function_name = "acp-demo-im-evaluation-config"
  description   = "Training lambda for intelligence mining"

  create_package = false

  timeout       = 60
  memory_size   = 128
  architectures = ["x86_64"]

  environment_variables = {
    SENTRY_DSN         = var.sentry_dsn
    SENTRY_ENVIRONMENT = var.environment
  }

  # Container Image
  image_uri            = "${data.aws_ecr_repository.im.repository_url}@${data.aws_ecr_image.im-lambda-evaluation-config.image_digest}"
  package_type         = "Image"
  image_config_command = ["lambdex_handler.handler"]
}


module "evaluation_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "4.10.1"

  function_name = "acp-demo-im-evaluation"
  description   = "Evalutiation lambda for intelligence mining"

  create_package = false

  timeout       = 15 * 60
  memory_size   = 1024
  architectures = ["x86_64"]

  environment_variables = {
    SENTRY_DSN              = var.sentry_dsn
    SENTRY_ENVIRONMENT      = var.environment
    ACP_DEMO_RESULTS_BUCKET = aws_s3_bucket.results-bucket.id
  }

  attach_policy_statements = true
  policy_statements = {
    s3 = {
      effect  = "Allow",
      actions = ["s3:HeadObject", "s3:GetObject", "s3:PutObject"],
      resources = [
        aws_s3_bucket.results-bucket.arn,
        "${aws_s3_bucket.results-bucket.arn}/*",
      ]
    }
  }

  # Container Image
  image_uri            = "${data.aws_ecr_repository.im.repository_url}@${data.aws_ecr_image.im-lambda-evaluation.image_digest}"
  package_type         = "Image"
  image_config_command = ["lambdex_handler.handler"]
}
