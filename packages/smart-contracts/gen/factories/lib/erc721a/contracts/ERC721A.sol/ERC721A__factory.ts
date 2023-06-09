/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import type { Provider, TransactionRequest } from '@ethersproject/providers'
import type { PromiseOrValue } from '../../../../../common'
import type {
  ERC721A,
  ERC721AInterface,
} from '../../../../../lib/erc721a/contracts/ERC721A.sol/ERC721A'

const _abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ApprovalCallerNotOwnerNorApproved',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ApprovalQueryForNonexistentToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BalanceQueryForZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MintERC2309QuantityExceedsLimit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MintToZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MintZeroQuantity',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OwnerQueryForNonexistentToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OwnershipNotInitializedForExtraData',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TransferCallerNotOwnerNorApproved',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TransferFromIncorrectOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TransferToNonERC721ReceiverImplementer',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TransferToZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'URIQueryForNonexistentToken',
    type: 'error',
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
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
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
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'fromTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'toTokenId',
        type: 'uint256',
      },
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
    ],
    name: 'ConsecutiveTransfer',
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
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
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
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
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
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
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
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'payable',
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
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
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
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

const _bytecode =
  '0x60806040523480156200001157600080fd5b506040516200100e3803806200100e833981016040819052620000349162000123565b60026200004283826200021c565b5060036200005182826200021c565b50506000805550620002e8565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200008657600080fd5b81516001600160401b0380821115620000a357620000a36200005e565b604051601f8301601f19908116603f01168101908282118183101715620000ce57620000ce6200005e565b81604052838152602092508683858801011115620000eb57600080fd5b600091505b838210156200010f5785820183015181830184015290820190620000f0565b600093810190920192909252949350505050565b600080604083850312156200013757600080fd5b82516001600160401b03808211156200014f57600080fd5b6200015d8683870162000074565b935060208501519150808211156200017457600080fd5b50620001838582860162000074565b9150509250929050565b600181811c90821680620001a257607f821691505b602082108103620001c357634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021757600081815260208120601f850160051c81016020861015620001f25750805b601f850160051c820191505b818110156200021357828155600101620001fe565b5050505b505050565b81516001600160401b038111156200023857620002386200005e565b62000250816200024984546200018d565b84620001c9565b602080601f8311600181146200028857600084156200026f5750858301515b600019600386901b1c1916600185901b17855562000213565b600085815260208120601f198616915b82811015620002b95788860151825594840194600190910190840162000298565b5085821015620002d85787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610d1680620002f86000396000f3fe6080604052600436106100dd5760003560e01c80636352211e1161007f578063a22cb46511610059578063a22cb46514610224578063b88d4fde14610244578063c87b56dd14610257578063e985e9c51461027757600080fd5b80636352211e146101cf57806370a08231146101ef57806395d89b411461020f57600080fd5b8063095ea7b3116100bb578063095ea7b31461017157806318160ddd1461018657806323b872dd146101a957806342842e0e146101bc57600080fd5b806301ffc9a7146100e257806306fdde0314610117578063081812fc14610139575b600080fd5b3480156100ee57600080fd5b506101026100fd36600461098b565b6102c0565b60405190151581526020015b60405180910390f35b34801561012357600080fd5b5061012c610312565b60405161010e91906109f8565b34801561014557600080fd5b50610159610154366004610a0b565b6103a4565b6040516001600160a01b03909116815260200161010e565b61018461017f366004610a3b565b6103df565b005b34801561019257600080fd5b50600154600054035b60405190815260200161010e565b6101846101b7366004610a65565b6103ef565b6101846101ca366004610a65565b610554565b3480156101db57600080fd5b506101596101ea366004610a0b565b610574565b3480156101fb57600080fd5b5061019b61020a366004610aa1565b61057f565b34801561021b57600080fd5b5061012c6105c5565b34801561023057600080fd5b5061018461023f366004610abc565b6105d4565b610184610252366004610b0e565b610640565b34801561026357600080fd5b5061012c610272366004610a0b565b610681565b34801561028357600080fd5b50610102610292366004610bea565b6001600160a01b03918216600090815260076020908152604080832093909416825291909152205460ff1690565b60006301ffc9a760e01b6001600160e01b0319831614806102f157506380ac58cd60e01b6001600160e01b03198316145b8061030c5750635b5e139f60e01b6001600160e01b03198316145b92915050565b60606002805461032190610c1d565b80601f016020809104026020016040519081016040528092919081815260200182805461034d90610c1d565b801561039a5780601f1061036f5761010080835404028352916020019161039a565b820191906000526020600020905b81548152906001019060200180831161037d57829003601f168201915b5050505050905090565b60006103af82610709565b6103c3576103c36333d1c03960e21b610730565b506000908152600660205260409020546001600160a01b031690565b6103eb8282600161073a565b5050565b60006103fa826107dd565b6001600160a01b0394851694909150811684146104205761042062a1148160e81b610730565b60008281526006602052604090208054338082146001600160a01b03881690911417610464576104508633610292565b61046457610464632ce44b5f60e11b610730565b801561046f57600082555b6001600160a01b038681166000908152600560205260408082208054600019019055918716808252919020805460010190554260a01b17600160e11b17600085815260046020526040812091909155600160e11b84169003610501576001840160008181526004602052604081205490036104ff5760005481146104ff5760008181526004602052604090208490555b505b6001600160a01b0385168481887fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef600080a48060000361054b5761054b633a954ecd60e21b610730565b50505050505050565b61056f83838360405180602001604052806000815250610640565b505050565b600061030c826107dd565b60006001600160a01b03821661059f5761059f6323d3ad8160e21b610730565b506001600160a01b031660009081526005602052604090205467ffffffffffffffff1690565b60606003805461032190610c1d565b3360008181526007602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61064b8484846103ef565b6001600160a01b0383163b1561067b576106678484848461084c565b61067b5761067b6368d2bf6b60e11b610730565b50505050565b606061068c82610709565b6106a0576106a0630a14c4b560e41b610730565b60006106b760408051602081019091526000815290565b905080516000036106d75760405180602001604052806000815250610702565b806106e18461092e565b6040516020016106f2929190610c57565b6040516020818303038152906040525b9392505050565b600080548210801561030c575050600090815260046020526040902054600160e01b161590565b8060005260046000fd5b600061074583610574565b905081801561075d5750336001600160a01b03821614155b156107805761076c8133610292565b610780576107806367d9dca160e11b610730565b60008381526006602052604080822080546001600160a01b0319166001600160a01b0388811691821790925591518693918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a450505050565b60008181526004602052604081205490600160e01b8216900361083c578060000361083757600054821061081b5761081b636f96cda160e11b610730565b5b5060001901600081815260046020526040902054801561081c575b919050565b610837636f96cda160e11b610730565b604051630a85bd0160e11b81526000906001600160a01b0385169063150b7a0290610881903390899088908890600401610c86565b6020604051808303816000875af19250505080156108bc575060408051601f3d908101601f191682019092526108b991810190610cc3565b60015b610911573d8080156108ea576040519150601f19603f3d011682016040523d82523d6000602084013e6108ef565b606091505b508051600003610909576109096368d2bf6b60e11b610730565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050949350505050565b606060a06040510180604052602081039150506000815280825b600183039250600a81066030018353600a9004806109485750819003601f19909101908152919050565b6001600160e01b03198116811461098857600080fd5b50565b60006020828403121561099d57600080fd5b813561070281610972565b60005b838110156109c35781810151838201526020016109ab565b50506000910152565b600081518084526109e48160208601602086016109a8565b601f01601f19169290920160200192915050565b60208152600061070260208301846109cc565b600060208284031215610a1d57600080fd5b5035919050565b80356001600160a01b038116811461083757600080fd5b60008060408385031215610a4e57600080fd5b610a5783610a24565b946020939093013593505050565b600080600060608486031215610a7a57600080fd5b610a8384610a24565b9250610a9160208501610a24565b9150604084013590509250925092565b600060208284031215610ab357600080fd5b61070282610a24565b60008060408385031215610acf57600080fd5b610ad883610a24565b915060208301358015158114610aed57600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b60008060008060808587031215610b2457600080fd5b610b2d85610a24565b9350610b3b60208601610a24565b925060408501359150606085013567ffffffffffffffff80821115610b5f57600080fd5b818701915087601f830112610b7357600080fd5b813581811115610b8557610b85610af8565b604051601f8201601f19908116603f01168101908382118183101715610bad57610bad610af8565b816040528281528a6020848701011115610bc657600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b60008060408385031215610bfd57600080fd5b610c0683610a24565b9150610c1460208401610a24565b90509250929050565b600181811c90821680610c3157607f821691505b602082108103610c5157634e487b7160e01b600052602260045260246000fd5b50919050565b60008351610c698184602088016109a8565b835190830190610c7d8183602088016109a8565b01949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090610cb9908301846109cc565b9695505050505050565b600060208284031215610cd557600080fd5b81516107028161097256fea2646970667358221220bf54790c118aa1360ccfaffb0bd96204e7b4447285e936fc536fc90dd22eb04b64736f6c63430008110033'

type ERC721AConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: ERC721AConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class ERC721A__factory extends ContractFactory {
  constructor(...args: ERC721AConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
  }

  override deploy(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ERC721A> {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<ERC721A>
  }
  override getDeployTransaction(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {})
  }
  override attach(address: string): ERC721A {
    return super.attach(address) as ERC721A
  }
  override connect(signer: Signer): ERC721A__factory {
    return super.connect(signer) as ERC721A__factory
  }

  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): ERC721AInterface {
    return new utils.Interface(_abi) as ERC721AInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): ERC721A {
    return new Contract(address, _abi, signerOrProvider) as ERC721A
  }
}
