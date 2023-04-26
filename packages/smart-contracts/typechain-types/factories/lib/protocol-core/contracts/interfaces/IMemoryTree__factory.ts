/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IMemoryTree,
  IMemoryTreeInterface,
} from "../../../../../lib/protocol-core/contracts/interfaces/IMemoryTree";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "brainAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "brainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nodeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "nodeHash",
        type: "bytes32",
      },
    ],
    name: "MemoryNodeAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "brainAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "brainId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "nodeHash",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "storageURI",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "addMemoryTree",
    outputs: [
      {
        internalType: "uint256",
        name: "treeId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nodeId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "parentNodeId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "nodeHash",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "storageURI",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "addNode",
    outputs: [
      {
        internalType: "uint256",
        name: "nodeId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getMemoryNode",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "memoryTreeId",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "children",
            type: "uint256[]",
          },
          {
            internalType: "string",
            name: "storageURI",
            type: "string",
          },
        ],
        internalType: "struct IMemoryTree.MemoryNode",
        name: "node",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getMemoryTreeDetails",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "brainAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "brainId",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "rootNodes",
            type: "uint256[]",
          },
        ],
        internalType: "struct IMemoryTree.MemoryTreeDetails",
        name: "details",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSigner",
    outputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IMemoryTree__factory {
  static readonly abi = _abi;
  static createInterface(): IMemoryTreeInterface {
    return new utils.Interface(_abi) as IMemoryTreeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IMemoryTree {
    return new Contract(address, _abi, signerOrProvider) as IMemoryTree;
  }
}
