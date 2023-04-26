module "lambda_s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "acp-demo-${var.environment}-lambda-artifacts"
  acl    = "private"

  versioning = {
    enabled = true
  }
}
