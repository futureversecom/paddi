output "step_function_arn" {
  value = module.step_function.state_machine_arn
}

output "im_events_sqs_arn" {
  value = aws_sqs_queue.im_events.arn
}

output "im_results_domain_name" {
  value = aws_cloudfront_distribution.results-bucket.domain_name
}
