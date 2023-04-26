module "gql_server_apigateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "1.5.0"

  name          = "acp-demo-gql-server"
  description   = "GraphQL API for ACP Demo"
  protocol_type = "HTTP"

  create_vpc_link = false

  create_api_domain_name = false
  # domain_name                 = aws_route53_zone.api.name
  # domain_name_certificate_arn = module.api_certificate.acm_certificate_arn

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent", "access-control-allow-headers"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  default_route_settings = {
    detailed_metrics_enabled = true
    throttling_rate_limit    = 1000
    throttling_burst_limit   = 500
  }

  integrations = {
    "GET /graphql" = {
      lambda_arn             = module.gql_server_handler_lambda.lambda_function_arn
      payload_format_version = "2.0"
    }

    "POST /graphql" = {
      lambda_arn             = module.gql_server_handler_lambda.lambda_function_arn
      payload_format_version = "2.0"
    }
  }
}
