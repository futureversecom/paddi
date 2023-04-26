resource "null_resource" "env_file" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = <<-EOT
      echo "\nVITE_API_ENDPOINT=${module.acp_demo_gql-server.api_endpoint}/graphql" >> ../../../../packages/web-app/.env
      echo "VITE_REPLAY_ENDPOINT=https://${module.acp_demo_im.im_results_domain_name}/" >> ../../../../packages/web-app/.env
    EOT
  }
}

