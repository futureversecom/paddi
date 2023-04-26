resource "aws_sqs_queue" "consumer-queue" {
  name                       = "consumer-queue-porcini"
  message_retention_seconds  = 600    // 10 minutes
  visibility_timeout_seconds = 60 * 5 // 5 minutes
}

data "aws_iam_policy_document" "sqs-policy" {
  statement {
    effect = "Allow"

    actions = [
      "sqs:SendMessage"
    ]

    resources = [
      aws_sqs_queue.consumer-queue.arn
    ]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values = [
        aws_cloudwatch_event_rule.all-events.arn
      ]
    }
  }
}

# Allow the EventBridge to send messages to the SQS queue.
resource "aws_sqs_queue_policy" "sqs-policy" {
  queue_url = aws_sqs_queue.consumer-queue.id
  policy    = data.aws_iam_policy_document.sqs-policy.json
}
