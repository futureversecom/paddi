# Define a provider for accessing the chain sync event bus
provider "aws" {
  alias  = "chain-sync-dev"
  region = "us-west-2"

  assume_role {
    role_arn = "arn:aws:iam::872291908522:role/ChainSyncCrossAccountManagement"
  }
}

locals {
  event_bus_name = "arn:aws:events:us-west-2:872291908522:event-bus/chain-sync-service-bus-${var.chain_name}"
}

# Create an event rule in the ChainSyncService event bus to filter events specific for the receiver 
# (This could be done from the receiving account as ChainSync has cross-account rule creation permissions).
resource "aws_cloudwatch_event_rule" "chain_sync_service_event_rule" {
  name_prefix    = "ReceiverRule-"
  event_bus_name = local.event_bus_name
  description    = "Chain events for acp-demo"
  event_pattern = jsonencode({
    "source"      = ["chain-sync-service"],
    "detail-type" = ["chain-event"],
    "detail" = {
      "address" = [for address in var.event_pattern_addresses : lower(address)]
    }
  })

  provider = aws.chain-sync-dev
}

# Create an event target to publish events matching the rule to the receiver event bus. This will send events to the receiver's event bus.
resource "aws_cloudwatch_event_target" "chain_sync_service_event_target" {
  rule           = aws_cloudwatch_event_rule.chain_sync_service_event_rule.name
  event_bus_name = local.event_bus_name
  arn            = aws_cloudwatch_event_bus.receiver.arn
  role_arn       = "arn:aws:iam::872291908522:role/ChainSyncCrossAccountPublish"

  provider = aws.chain-sync-dev
}

