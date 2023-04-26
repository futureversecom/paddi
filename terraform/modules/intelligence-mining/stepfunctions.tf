module "step_function" {
  source = "terraform-aws-modules/step-functions/aws"

  name = "im-stepfunctions"
  definition = templatefile("../../../../packages/im-stepfunctions/resources/im-stepfunctions.asl.json", {
    training_lambda_arn              = module.training_lambda.lambda_function_arn
    get_evaluation_config_lambda_arn = module.evaluation_config_lambda.lambda_function_arn
    evaluation_lambda_arn            = module.evaluation_lambda.lambda_function_arn
    im_events_sqs_queue_url          = aws_sqs_queue.im_events.url
  })

  service_integrations = {
    lambda = {
      lambda = [
        module.training_lambda.lambda_function_arn,
        module.evaluation_config_lambda.lambda_function_arn,
        module.evaluation_lambda.lambda_function_arn,
      ]
    }

    sqs = {
      sqs = [
        aws_sqs_queue.im_events.arn,
      ]
    }
  }

  type = "STANDARD"

  tags = {
    Module = "my"
  }
}
