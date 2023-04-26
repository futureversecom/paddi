# contract addresses for event pattern
variable "event_pattern_addresses" {
  type = list(string)
}

variable "chain_name" {
  type = string
}

variable "environment" {
  description = "dev / staging / prod"
}

variable "cost_center" {
  default = "acp-demo"
}

variable "tables" {
  type = object({
    training_record = object({
      arn  = string
      name = string
    })
  })
}

variable "step_function_arn" {

}

variable "im_results_domain_name" {

}

variable "sentry_dsn" {
  description = "Sentry DSN"
}
