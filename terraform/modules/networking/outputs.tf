output "domain_ns" {
  value = resource.aws_route53_zone.domain.name_servers
}

output "domain_name" {
  value = resource.aws_route53_zone.domain.name
}
