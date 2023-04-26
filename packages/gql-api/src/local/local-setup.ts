// set environment variables for the app
Object.assign(process.env, {
  ENVIRONMENT: 'dev',
  LOGIN_NONCE_TABLE_NAME: 'acp-demo-login-nonce',
  TRAINING_RECORD_TABLE_NAME: 'acp-demo-training-record',
  LOCALSTACK_ENDPOINT: 'http://127.0.0.1:4566',
  RPC_URL: 'https://porcini.rootnet.app',
})
