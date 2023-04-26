# ASM Core Protocol Demo Smart Contracts

This package includes smart contracts required to run the ACP Demo.
This builds on smart contracts at the [ASM Core Protocol repo](https://github.com/altered-state-machine/protocol-core).

## Components

### Mock ASTO

This will be used as an ASTO faucet on test networks.
The Mock ASTO contract allows users to freely mint ERC20 tokens.

### Mock Brains

This will be used as an ASM Brain faucet on test networks.
The Mock Brains contract allows users to freely mint ERC721 tokens.
The tokenURI will point to the same metadata location as [Gen II Brains](https://etherscan.io/address/0x86599b800e23036d761f43d7516092447295659f).

### Challenge

The Challenge contract will enable users to created paid contests between other users.

<br/>

## Setup

### Software Pre-requisites

- [foundry](https://book.getfoundry.sh/getting-started/installation) must be installed

### Install, Build, Test

Retrieve git submodules:

```sh
forge install
```

Build contracts:

```sh
forge build
```

Generate ABI:

```sh
forge inspect MockASTO abi >> abi/MockASTO.json
forge inspect MockBrain abi >> abi/MockBrain.json
forge inspect PongMemoryTree abi >> abi/PongMemoryTree.json
forge inspect PongComputeManager abi >> abi/PongComputeManager.json
forge inspect Challenge abi >> abi/Challenge.json
```

<br/>

## Testing

```sh
forge test -vvv
```

<br/>

## Deployment

To use the Futuverse's protocol you will need:

- ASTO tokens, to pay for the use of the protocol
- Connectiob to the ROOT blockchain testnet
- XRP tokens to pay gas for transactions
- Your set of (studio) contracts which can connect to the protocol

Copy the `.env.example` file to `.env` and fill in the required values.

1. Rename `.env.example` to `.env`

   ```sh
   cp .env.example .env
   ```

2. Use your wallet to get some XRP from the [faucet](https://faucet.rootnet.cloud/)
3. Add your wallet to the config `.env`, as a `DEPLOYER` and `DEPLOYER_PK`

Note: Dummy values (private key and public address) for all accounts for the local test version have been provided. Do not use them for your real projects.

### Deploying to local network (for testing)

Check everything works fine by mocking deployment to the local blockchain:

1. Start local node by running `yarn node:local` or [anvil](https://book.getfoundry.sh/tutorials/solidity-scripting#deploying-locally) in the terminal.
2. In another terminal window run command:

   ```sh
   yarn deploy:local
   ```

This will deploy all contracts.
You can deploy just one contract, by specifying the tag of the contract to deploy (see scripts in the `/deploy/` folder), e.g. `yarn deploy:local --tags PongMemoryTree`

### Prod deployment

By "prod" we mean Porcini network, which is still a testnet for the Root network.

```sh
yarn deploy:porcini
```

This will deploy all contracts.
You can deploy just one contract, by specifying the tag of the contract to deploy (see scripts in the `/deploy/` folder), e.g. `yarn deploy:porcini --tags PongMemoryTree`

<br/>

## Scripts

For the following scripts update the `--network` param as needed.

We have bunch of scripts for you (see `/scripts` folder) to communicate with contracts:

- `mt-set-signer` - to change the signer address
- `mt-get-tree` - get details of the specific memory tree
- `mt-add-tree` - to add a new tree (requires a signature, see below)
- `mt-add-node` - to add a new node to the tree (also requires a signature)
- `gen-signature -` to generate signature to add a tree or node
- `crm-request-compute` - to create a new compute request for a training (for the user)
- `crm-revoke-compute` - to cancel it (for the user)
- `crm-complete-compute` - to mark request as finished (for the studio)
- `crm-view-request` - to get details of the open compute request

To use the script run in the terminal:

```sh
yarn ${script_name} --network ${network_name} [--param value]
```

Here is the list of params for scripts:

- mt-set-signer
  - `signer` - new signer (address)
- mt-get-tree
  - `id` - Tree ID (number)
- mt-add-tree
  - `brain` - Brain contract (address)
  - `id` - Brain token ID (number)
  - `studio` - Studio ID (name)
  - `storage` - Storage URI (string)
  - `signature` - Signature (string of bytes, e.g. `0x102eb376350ab0166e8be170e7d6abadb282a62a62ca470986b254fb64a20b6066b33722e8892445aefa315fa56e020e20f6a5196629b8c929d487f8f252dedc1b`)
- mt-add-node
  - `id` - Parent node ID (number)
  - `studio` - Studio ID (string)
  - `storage` - Storage URI (string)
  - `signature` - Signature (string of bytes, e.g. `0x102eb376350ab0166e8be170e7d6abadb282a62a62ca470986b254fb64a20b6066b33722e8892445aefa315fa56e020e20f6a5196629b8c929d487f8f252dedc1b`)
- gen-signature
  - `type` - Type to add (`node` or `tree`)
  - `brain` - [OPTIONAL] Address of the Brain contract
  - `id` - Parent node ID or Brain token id (number)
  - `studio` - Studio ID (string)
  - `storage` - Storage URI (string)
- crm-request-compute
  - `option` - Option ID (number)
  - `units` - Units to spend (number)
  - `studio` - Studio identifier (string)
- crm-revoke-compute
  - `id` - Compute request ID (number)
- crm-complete-compute
  - `id` - Compute request ID (number)
- crm-view-request
  - `id` - Compute request ID (number)
