variable "environment" {
  type        = string
  description = "dev / staging / prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Allowed values for input_parameter are \"dev\", \"staging\", or \"prod\"."
  }
}

variable "image_tag_suffix" {
  type        = string
  description = "The suffix to use for the image tag branch name/commit hash/build number..."
}
