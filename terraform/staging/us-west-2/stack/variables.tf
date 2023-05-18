variable "im_image_tag_suffix" {
  type        = string
  description = "The suffix to use for the IM image tag branch name/commit hash/build number..."
  default     = "main"
}

# Setup in buildkite env
variable "sentry_dsn" {
  type = string
}

variable "allowed_account_ids" {
  type = list(string)
}
