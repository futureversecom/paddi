resource "aws_ecr_repository" "im-images" {
  name = "asm-protocol-acp-demo"
}

resource "aws_ecr_lifecycle_policy" "im-images" {
  repository = aws_ecr_repository.im-images.name

  policy = jsonencode(
    {
      "rules" : [
        {
          "rulePriority" : 1,
          "description" : "Expire images older than 30 days",
          "selection" : {
            "tagStatus" : "untagged",
            "countType" : "sinceImagePushed",
            "countUnit" : "days",
            "countNumber" : 30
          },
          "action" : {
            "type" : "expire"
          }
        }
      ]
    }
  )
}

data "aws_iam_policy_document" "ou-access" {
  statement {
    sid    = "ReadAccessFromOU"
    effect = "Allow"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetAuthorizationToken",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetRepositoryPolicy",
      "ecr:SetRepositoryPolicy",
      "ecr:DescribeRepositories",
      "ecr:ListImages",
      "ecr:DescribeImages",
      "ecr:BatchGetImage",
      "ecr:ListTagsForResource",
    ]

    # allow access to the repository from the OU
    condition {
      test     = "ForAnyValue:StringLike"
      variable = "aws:PrincipalOrgPaths"
      values = [
        "o-pifbwsnxa6/*/ou-auqi-vn39i9cn/*",
      ]
    }
  }

  statement {
    sid    = "ReadAccessFromOULambdas"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetAuthorizationToken",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetRepositoryPolicy",
      "ecr:SetRepositoryPolicy",
      "ecr:DescribeRepositories",
      "ecr:ListImages",
      "ecr:DescribeImages",
      "ecr:BatchGetImage",
      "ecr:ListTagsForResource",
    ]
  }
}

resource "aws_ecr_repository_policy" "im-images" {
  repository = aws_ecr_repository.im-images.name
  policy     = data.aws_iam_policy_document.ou-access.json
}
