locals {
  results_bucket_name = "asm-protocol-${var.environment}-im-results"

  training_models = {
    "balanced" = "balanced.zip"
    "heavy"    = "heavy.zip"
    "light"    = "light.zip"
  }
}

data "aws_iam_policy_document" "s3_bucket_policy_asset" {
  statement {
    sid = "1"

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "arn:aws:s3:::${local.results_bucket_name}/*",
    ]

    principals {
      type = "AWS"

      identifiers = [
        aws_cloudfront_origin_access_identity.origin_access_identity_asset.iam_arn,
      ]
    }
  }
}

# Intermediate training results bucket that includes models, logs, etc.
resource "aws_s3_bucket" "results-bucket" {
  bucket = local.results_bucket_name
  acl    = "private"

  versioning {
    enabled = true
  }

  policy = data.aws_iam_policy_document.s3_bucket_policy_asset.json

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}


# upload training models
resource "aws_s3_object" "training-models" {
  # iterate over the training models
  for_each = local.training_models

  bucket = aws_s3_bucket.results-bucket.id
  key    = "training_models/${each.key}.zip"
  source = "../../../../packages/pong-simulation/models/${each.value}"
  etag   = filemd5("../../../../packages/pong-simulation/models/${each.value}")
}
