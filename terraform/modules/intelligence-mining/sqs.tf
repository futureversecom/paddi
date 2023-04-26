resource "aws_sqs_queue" "im_events" {
  name       = "acp-demo-im-events.fifo"
  fifo_queue = true
}

