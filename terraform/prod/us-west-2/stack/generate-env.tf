resource "null_resource" "env_file" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = <<-EOT
      echo "VITE_API_ENDPOINT=${module.acp_demo_gql-server.api_endpoint}/graphql" >> ../../../../packages/web-app/.env.${local.environment}
      echo "VITE_REPLAY_ENDPOINT=https://${module.acp_demo_im.im_results_domain_name}/" >> ../../../../packages/web-app/.env.${local.environment}
    EOT
  }
}

