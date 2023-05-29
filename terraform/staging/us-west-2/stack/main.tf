

module "acp-demo-service-core" {
  source = "../../../modules/service-core"
}

module "acp_demo_gql-server" {
  source = "../../../modules/gql-server"

  sentry_dsn  = var.sentry_dsn
  environment = local.environment
  rpc_url     = local.rpc_url
  tables = {
    login_nonce     = module.acp-demo-service-core.tables.login-nonce
    training_record = module.acp-demo-service-core.tables.training-record
  }
}

module "acp_demo_web_app" {
  source = "../../../modules/web-app"

  domain_name = module.networking.domain_name
  environment = local.environment

  providers = {
    aws.global = aws.global
  }

  depends_on = [
    module.networking
  ]
}

module "acp_demo_im" {
  source = "../../../modules/intelligence-mining"

  environment      = local.environment
  sentry_dsn       = "https://fc0665d760d742f98e2070189dfecb46@o1024674.ingest.sentry.io/4505242550665216"
  image_tag_suffix = var.im_image_tag_suffix
}

module "acp_demo_chain-sync" {
  source                  = "../../../modules/chain-sync"
  event_pattern_addresses = local.event_pattern_addresses
  chain_name              = local.chain_name

  # lambda vars
  sentry_dsn  = var.sentry_dsn
  environment = local.environment
  tables = {
    training_record = module.acp-demo-service-core.tables.training-record
  }
  step_function_arn      = module.acp_demo_im.step_function_arn
  im_results_domain_name = module.acp_demo_im.im_results_domain_name
}


module "acp_demo_event_handlers" {
  source = "../../../modules/event-handlers"

  sentry_dsn  = var.sentry_dsn
  environment = local.environment
  tables = {
    training_record = module.acp-demo-service-core.tables.training-record
  }
  im_events_sqs_arn = module.acp_demo_im.im_events_sqs_arn
}

module "networking" {
  source      = "../../../modules/networking"
  domain_name = "paddi-staging.al8st.me"
}
