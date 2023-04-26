
# Create an event bus on the receiver account to receive events from ChainSyncService and setup cross account permissions for receiver.
resource "aws_cloudwatch_event_bus" "receiver" {
  name = "chain-events"
}

data "aws_iam_policy_document" "allow_chain_sync_events" {
  statement {
    sid       = "AllowChainSyncServiceToPublish"
    effect    = "Allow"
    actions   = ["events:PutEvents"]
    resources = [aws_cloudwatch_event_bus.receiver.arn]

    principals {
      identifiers = ["arn:aws:iam::872291908522:role/ChainSyncCrossAccountPublish"]
      type        = "AWS"
    }
  }
}

# Event bus policy to allow the chain-sync service to publish events
resource "aws_cloudwatch_event_bus_policy" "chain_events_bus_policy" {
  event_bus_name = aws_cloudwatch_event_bus.receiver.name
  policy         = data.aws_iam_policy_document.allow_chain_sync_events.json
}


resource "aws_cloudwatch_event_rule" "all-events" {
  name_prefix    = "acp-demo-consumer-all-events-"
  event_bus_name = aws_cloudwatch_event_bus.receiver.name
  description    = "chain sync service all events"
  event_pattern = jsonencode({
    source = ["chain-sync-service"]
  })
}

resource "aws_cloudwatch_event_target" "sqs-target" {
  rule           = aws_cloudwatch_event_rule.all-events.name
  arn            = aws_sqs_queue.consumer-queue.arn
  event_bus_name = aws_cloudwatch_event_bus.receiver.name
}
