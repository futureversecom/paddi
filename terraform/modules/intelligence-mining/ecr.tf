data "aws_ecr_repository" "im" {
  name = "asm-protocol-acp-demo"
  // CI account
  registry_id = "437218020055"
}

data "aws_ecr_image" "im-lambda-training" {
  repository_name = data.aws_ecr_repository.im.name
  registry_id     = data.aws_ecr_repository.im.registry_id
  image_tag       = "training_handler_${var.image_tag_suffix}"
}

data "aws_ecr_image" "im-lambda-evaluation-config" {
  repository_name = data.aws_ecr_repository.im.name
  registry_id     = data.aws_ecr_repository.im.registry_id
  image_tag       = "evaluation_config_handler_${var.image_tag_suffix}"
}

data "aws_ecr_image" "im-lambda-evaluation" {
  repository_name = data.aws_ecr_repository.im.name
  registry_id     = data.aws_ecr_repository.im.registry_id
  image_tag       = "evaluation_handler_${var.image_tag_suffix}"
}
