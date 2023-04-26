/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import type { Provider, TransactionRequest } from '@ethersproject/providers'
import type { PromiseOrValue } from '../../common'
import type { MockASTO, MockASTOInterface } from '../../src/MockASTO'

const _abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
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
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
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
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
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
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'faucet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'faucetTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
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
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const _bytecode =
  '0x608060405234801561001057600080fd5b5060405180606001604052806023815260200162000b7f602391396040805180820190915260048152634153544f60e01b602082015260036100528382610106565b50600461005f8282610106565b5050506101c5565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061009157607f821691505b6020821081036100b157634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561010157600081815260208120601f850160051c810160208610156100de5750805b601f850160051c820191505b818110156100fd578281556001016100ea565b5050505b505050565b81516001600160401b0381111561011f5761011f610067565b6101338161012d845461007d565b846100b7565b602080601f83116001811461016857600084156101505750858301515b600019600386901b1c1916600185901b1785556100fd565b600085815260208120601f198616915b8281101561019757888601518255948401946001909101908401610178565b50858210156101b55787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6109aa80620001d56000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063766976401161008c578063a457c2d711610066578063a457c2d7146101cd578063a9059cbb146101e0578063dd62ed3e146101f3578063de5f72fd1461020657600080fd5b806376697640146101a057806393492d25146101b057806395d89b41146101c557600080fd5b806323b872dd116100c857806323b872dd14610142578063313ce56714610155578063395093511461016457806370a082311461017757600080fd5b806306fdde03146100ef578063095ea7b31461010d57806318160ddd14610130575b600080fd5b6100f761020e565b60405161010491906107f4565b60405180910390f35b61012061011b36600461085e565b6102a0565b6040519015158152602001610104565b6002545b604051908152602001610104565b610120610150366004610888565b6102ba565b60405160128152602001610104565b61012061017236600461085e565b6102de565b6101346101853660046108c4565b6001600160a01b031660009081526020819052604090205490565b61013468056bc75e2d6310000081565b6101c36101be3660046108c4565b610300565b005b6100f7610316565b6101206101db36600461085e565b610325565b6101206101ee36600461085e565b6103a5565b6101346102013660046108e6565b6103b3565b6101c36103de565b60606003805461021d90610919565b80601f016020809104026020016040519081016040528092919081815260200182805461024990610919565b80156102965780601f1061026b57610100808354040283529160200191610296565b820191906000526020600020905b81548152906001019060200180831161027957829003601f168201915b5050505050905090565b6000336102ae8185856103f3565b60019150505b92915050565b6000336102c8858285610517565b6102d3858585610591565b506001949350505050565b6000336102ae8185856102f183836103b3565b6102fb9190610953565b6103f3565b6103138168056bc75e2d63100000610735565b50565b60606004805461021d90610919565b6000338161033382866103b3565b9050838110156103985760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b6102d382868684036103f3565b6000336102ae818585610591565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6103f13368056bc75e2d63100000610735565b565b6001600160a01b0383166104555760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161038f565b6001600160a01b0382166104b65760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161038f565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600061052384846103b3565b9050600019811461058b578181101561057e5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161038f565b61058b84848484036103f3565b50505050565b6001600160a01b0383166105f55760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161038f565b6001600160a01b0382166106575760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161038f565b6001600160a01b038316600090815260208190526040902054818110156106cf5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161038f565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a361058b565b6001600160a01b03821661078b5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161038f565b806002600082825461079d9190610953565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600060208083528351808285015260005b8181101561082157858101830151858201604001528201610805565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b038116811461085957600080fd5b919050565b6000806040838503121561087157600080fd5b61087a83610842565b946020939093013593505050565b60008060006060848603121561089d57600080fd5b6108a684610842565b92506108b460208501610842565b9150604084013590509250925092565b6000602082840312156108d657600080fd5b6108df82610842565b9392505050565b600080604083850312156108f957600080fd5b61090283610842565b915061091060208401610842565b90509250929050565b600181811c9082168061092d57607f821691505b60208210810361094d57634e487b7160e01b600052602260045260246000fd5b50919050565b808201808211156102b457634e487b7160e01b600052601160045260246000fdfea2646970667358221220f66ca4e5e0e13e311dd654f0107dcb7f19652a5a6006f2e5ee8759e80421253a64736f6c63430008110033416c7465726564205374617465204d616368696e65205574696c69747920546f6b656e'

type MockASTOConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: MockASTOConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class MockASTO__factory extends ContractFactory {
  constructor(...args: MockASTOConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<MockASTO> {
    return super.deploy(overrides || {}) as Promise<MockASTO>
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {})
  }
  override attach(address: string): MockASTO {
    return super.attach(address) as MockASTO
  }
  override connect(signer: Signer): MockASTO__factory {
    return super.connect(signer) as MockASTO__factory
  }

  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): MockASTOInterface {
    return new utils.Interface(_abi) as MockASTOInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): MockASTO {
    return new Contract(address, _abi, signerOrProvider) as MockASTO
  }
}
