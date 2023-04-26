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


variable "im_events_sqs_arn" {

}

variable "sentry_dsn" {
  description = "Sentry DSN"
}
