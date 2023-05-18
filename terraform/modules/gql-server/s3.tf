module "lambda_s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "acp-demo-${var.environment}-lambda-artifacts"
  acl    = "private"

  control_object_ownership = true
  object_ownership         = "ObjectWriter"

  versioning = {
    enabled = true
  }
}
