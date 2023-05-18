terraform {
  required_version = "~> 1.3.4"

  backend "s3" {
    bucket         = "futureverse-terraform-asm-protocol-staging-staging"
    dynamodb_table = "terraform-locks"
    key            = "acp-demo"
    region         = "us-west-2"
    encrypt        = true
    acl            = "bucket-owner-full-control"
  }
}

provider "aws" {
  region              = "us-west-2"
  allowed_account_ids = var.allowed_account_ids
  default_tags {
    tags = {
      CostCenter = "asm-acp-demo"
    }
  }
}

provider "aws" {
  alias               = "global"
  region              = "us-east-1"
  allowed_account_ids = var.allowed_account_ids
  default_tags {
    tags = {
      CostCenter = "asm-acp-demo"
    }
  }
}
