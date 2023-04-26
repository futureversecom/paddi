
# agents
# ==============================================================================

resource "aws_dynamodb_table" "login-nonce" {
  name         = "acp-demo-login-nonce"
  hash_key     = "hk"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "hk"
    type = "S"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "training-record" {
  name         = "acp-demo-training-record"
  hash_key     = "hk"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "hk"
    type = "S"
  }

  attribute {
    name = "requestedBy"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  global_secondary_index {
    name            = "acp-demo-training-record-gsi"
    hash_key        = "requestedBy"
    range_key       = "timestamp"
    projection_type = "ALL"
  }

  # lifecycle {
  #   prevent_destroy = false
  # }
}
