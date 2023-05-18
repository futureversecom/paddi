resource "aws_route53_zone" "domain" {
  name = var.domain_name
}
