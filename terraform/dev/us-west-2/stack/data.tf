data "aws_caller_identity" "current" {}

data "aws_ecr_authorization_token" "token" {
  registry_id = data.aws_caller_identity.current.account_id
}
