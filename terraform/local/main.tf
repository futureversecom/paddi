module "acp-demo-service-core" {
  source = "../modules/service-core"
}

# manually configured secrets in production
resource "aws_secretsmanager_secret" "acp-demo" {
  name = "acp-demo"
}

resource "aws_secretsmanager_secret_version" "sversion" {
  secret_id     = aws_secretsmanager_secret.acp-demo.id
  secret_string = jsonencode(var.secret_value)
}
