output "tables" {
  value = {
    login-nonce     = aws_dynamodb_table.login-nonce
    training-record = aws_dynamodb_table.training-record
  }
}
