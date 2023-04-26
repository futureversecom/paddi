variable "secret_value" {
  type = object({
    JwtSecret = string
    # Gas faucet singer private key
    SignerPrivateKey = string
    # Memory Tree signer private key
    MemoryTreeSignerPrivateKey = string
  })
  description = "Secrets Manager secret value"
}
