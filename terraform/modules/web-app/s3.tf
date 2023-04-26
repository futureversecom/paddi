locals {
  bucket_name = "acp-demo-web-app-${var.environment}"
}

data "aws_iam_policy_document" "s3_bucket_policy_asset" {
  statement {
    sid = "1"

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "arn:aws:s3:::${local.bucket_name}/*",
    ]

    principals {
      type = "AWS"

      identifiers = [
        aws_cloudfront_origin_access_identity.origin_access_identity_asset.iam_arn,
      ]
    }
  }
}

resource "aws_s3_bucket" "web-app-bucket" {
  bucket = local.bucket_name
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

  lifecycle {
    prevent_destroy = false
  }
}
