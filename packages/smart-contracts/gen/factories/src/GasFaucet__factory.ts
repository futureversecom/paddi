/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import type { Provider, TransactionRequest } from '@ethersproject/providers'
import type { PromiseOrValue } from '../../common'
import type { GasFaucet, GasFaucetInterface } from '../../src/GasFaucet'

const _abi = [
  {
    inputs: [],
    name: 'AlreadySent',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BLOCK_DELAY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FAUCET_AMOUNT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'faucet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const

const _bytecode =
  '0x608060405234801561001057600080fd5b50610236806100206000396000f3fe6080604052600436106100435760003560e01c806312065fe01461004f57806376697640146100715780639e78f4591461008d578063b86d1d63146100a257600080fd5b3661004a57005b600080fd5b34801561005b57600080fd5b5030315b60405190815260200160405180910390f35b34801561007d57600080fd5b5061005f678ac7230489e8000081565b34801561009957600080fd5b5061005f600a81565b3480156100ae57600080fd5b506100c26100bd3660046101a9565b6100c4565b005b678ac7230489e80000303110156100ee57604051631e9acf1760e31b815260040160405180910390fd5b6001600160a01b038116600090815260208190526040812054439161011382846101d9565b90508115801590600a8311159082906101295750805b1561014757604051630d4a75cf60e41b815260040160405180910390fd5b6001600160a01b038616600081815260208190526040808220889055519091908290678ac7230489e800009082818181858883f193505050509050806101a0576040516312171d8360e31b815260040160405180910390fd5b50505050505050565b6000602082840312156101bb57600080fd5b81356001600160a01b03811681146101d257600080fd5b9392505050565b818103818111156101fa57634e487b7160e01b600052601160045260246000fd5b9291505056fea2646970667358221220902d922978351d8376b1a7d6bff7a525b5a59c3517381e3e3f191e4080ddd90b64736f6c63430008110033'

type GasFaucetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: GasFaucetConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class GasFaucet__factory extends ContractFactory {
  constructor(...args: GasFaucetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<GasFaucet> {
    return super.deploy(overrides || {}) as Promise<GasFaucet>
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {})
  }
  override attach(address: string): GasFaucet {
    return super.attach(address) as GasFaucet
  }
  override connect(signer: Signer): GasFaucet__factory {
    return super.connect(signer) as GasFaucet__factory
  }

  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): GasFaucetInterface {
    return new utils.Interface(_abi) as GasFaucetInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): GasFaucet {
    return new Contract(address, _abi, signerOrProvider) as GasFaucet
  }
}
