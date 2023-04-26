variable "sentry_dsn" {
  description = "Sentry DSN"
}

variable "environment" {
  description = "dev / staging / prod"
}

variable "rpc_url" {
}


variable "cost_center" {
  default = "acp-demo"
}

variable "tables" {
  type = object({
    login_nonce = object({
      arn  = string
      name = string
    })
    training_record = object({
      arn  = string
      name = string
    })
  })
}
