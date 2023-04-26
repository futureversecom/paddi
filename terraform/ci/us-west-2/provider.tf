terraform {
  required_version = "~> 1.3.4"

  backend "s3" {
    bucket         = "futureverse-terraform-ops-ci-default"
    dynamodb_table = "terraform-locks"
    key            = "acp-demo-ci"
    region         = "us-west-2"
    encrypt        = true
    acl            = "bucket-owner-full-control"
  }
}

provider "aws" {
  region              = "us-west-2"
  allowed_account_ids = ["437218020055"]
  default_tags {
    tags = {
      CostCenter = "asm-acp-demo"
    }
  }
}
