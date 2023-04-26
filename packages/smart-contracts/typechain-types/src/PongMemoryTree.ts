/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export declare namespace IMemoryTree {
  export type MemoryNodeStruct = {
    memoryTreeId: PromiseOrValue<BigNumberish>;
    children: PromiseOrValue<BigNumberish>[];
    storageURI: PromiseOrValue<string>;
  };

  export type MemoryNodeStructOutput = [BigNumber, BigNumber[], string] & {
    memoryTreeId: BigNumber;
    children: BigNumber[];
    storageURI: string;
  };

  export type MemoryTreeDetailsStruct = {
    brainAddress: PromiseOrValue<string>;
    brainId: PromiseOrValue<BigNumberish>;
    rootNodes: PromiseOrValue<BigNumberish>[];
  };

  export type MemoryTreeDetailsStructOutput = [
    string,
    BigNumber,
    BigNumber[]
  ] & { brainAddress: string; brainId: BigNumber; rootNodes: BigNumber[] };
}

export interface PongMemoryTreeInterface extends utils.Interface {
  functions: {
    "addMemoryTree(address,uint256,bytes32,string,bytes)": FunctionFragment;
    "addNode(uint256,bytes32,string,bytes)": FunctionFragment;
    "getMemoryNode(uint256)": FunctionFragment;
    "getMemoryTreeDetails(uint256)": FunctionFragment;
    "getSigner()": FunctionFragment;
    "memoryNodeIdsOfMemoryTree(uint256)": FunctionFragment;
    "memoryNodesOfMemoryTree(uint256)": FunctionFragment;
    "memoryTreesOfBrain(address,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setSigner(address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addMemoryTree"
      | "addNode"
      | "getMemoryNode"
      | "getMemoryTreeDetails"
      | "getSigner"
      | "memoryNodeIdsOfMemoryTree"
      | "memoryNodesOfMemoryTree"
      | "memoryTreesOfBrain"
      | "owner"
      | "renounceOwnership"
      | "setSigner"
      | "supportsInterface"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addMemoryTree",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addNode",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getMemoryNode",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getMemoryTreeDetails",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "getSigner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "memoryNodeIdsOfMemoryTree",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "memoryNodesOfMemoryTree",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "memoryTreesOfBrain",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setSigner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addMemoryTree",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addNode", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getMemoryNode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMemoryTreeDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getSigner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "memoryNodeIdsOfMemoryTree",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "memoryNodesOfMemoryTree",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "memoryTreesOfBrain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setSigner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "MemoryNodeAdded(address,uint256,uint256,bytes32)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MemoryNodeAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface MemoryNodeAddedEventObject {
  brainAddress: string;
  brainId: BigNumber;
  nodeId: BigNumber;
  nodeHash: string;
}
export type MemoryNodeAddedEvent = TypedEvent<
  [string, BigNumber, BigNumber, string],
  MemoryNodeAddedEventObject
>;

export type MemoryNodeAddedEventFilter = TypedEventFilter<MemoryNodeAddedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PongMemoryTree extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PongMemoryTreeInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addMemoryTree(
      brainAddress: PromiseOrValue<string>,
      brainId: PromiseOrValue<BigNumberish>,
      nodeHash: PromiseOrValue<BytesLike>,
      storageURI: PromiseOrValue<string>,
      signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addNode(
      parentNodeId: PromiseOrValue<BigNumberish>,
      nodeHash: PromiseOrValue<BytesLike>,
      storageURI: PromiseOrValue<string>,
      signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getMemoryNode(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [IMemoryTree.MemoryNodeStructOutput] & {
        node: IMemoryTree.MemoryNodeStructOutput;
      }
    >;

    getMemoryTreeDetails(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [IMemoryTree.MemoryTreeDetailsStructOutput] & {
        details: IMemoryTree.MemoryTreeDetailsStructOutput;
      }
    >;

    getSigner(
      overrides?: CallOverrides
    ): Promise<[string] & { signer: string }>;

    memoryNodeIdsOfMemoryTree(
      treeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { indexes: BigNumber[] }>;

    memoryNodesOfMemoryTree(
      treeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [IMemoryTree.MemoryNodeStructOutput[]] & {
        treeNodes: IMemoryTree.MemoryNodeStructOutput[];
      }
    >;

    memoryTreesOfBrain(
      brainAddress: PromiseOrValue<string>,
      brainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { indexes: BigNumber[] }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSigner(
      signer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addMemoryTree(
    brainAddress: PromiseOrValue<string>,
    brainId: PromiseOrValue<BigNumberish>,
    nodeHash: PromiseOrValue<BytesLike>,
    storageURI: PromiseOrValue<string>,
    signature: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addNode(
    parentNodeId: PromiseOrValue<BigNumberish>,
    nodeHash: PromiseOrValue<BytesLike>,
    storageURI: PromiseOrValue<string>,
    signature: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getMemoryNode(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<IMemoryTree.MemoryNodeStructOutput>;

  getMemoryTreeDetails(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<IMemoryTree.MemoryTreeDetailsStructOutput>;

  getSigner(overrides?: CallOverrides): Promise<string>;

  memoryNodeIdsOfMemoryTree(
    treeId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  memoryNodesOfMemoryTree(
    treeId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<IMemoryTree.MemoryNodeStructOutput[]>;

  memoryTreesOfBrain(
    brainAddress: PromiseOrValue<string>,
    brainId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSigner(
    signer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addMemoryTree(
      brainAddress: PromiseOrValue<string>,
      brainId: PromiseOrValue<BigNumberish>,
      nodeHash: PromiseOrValue<BytesLike>,
      storageURI: PromiseOrValue<string>,
      signature: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { treeId: BigNumber; nodeId: BigNumber }
    >;

    addNode(
      parentNodeId: PromiseOrValue<BigNumberish>,
      nodeHash: PromiseOrValue<BytesLike>,
      storageURI: PromiseOrValue<string>,
      signature: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMemoryNode(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IMemoryTree.MemoryNodeStructOutput>;

    getMemoryTreeDetails(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IMemoryTree.MemoryTreeDetailsStructOutput>;

    getSigner(overrides?: CallOverrides): Promise<string>;

    memoryNodeIdsOfMemoryTree(
      treeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    memoryNodesOfMemoryTree(
      treeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IMemoryTree.MemoryNodeStructOutput[]>;

    memoryTreesOfBrain(
      brainAddress: PromiseOrValue<string>,
      brainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setSigner(
      signer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "MemoryNodeAdded(address,uint256,uint256,bytes32)"(
      brainAddress?: null,
      brainId?: null,
      nodeId?: null,
      nodeHash?: null
    ): MemoryNodeAddedEventFilter;
    MemoryNodeAdded(
      brainAddress?: null,
      brainId?: null,
      nodeId?: null,
      nodeHash?: null
    ): MemoryNodeAddedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    addMemoryTree(
      brainAddress: PromiseOrValue<string>,
      brainId: PromiseOrValue<BigNumberish>,
      nodeHash: PromiseOrValue<BytesLike>,
      storageURI: PromiseOrValue<string>,
      signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addNode(
      parentNodeId: PromiseOrValue<BigNumberish>,
      nodeHash: PromiseOrValue<BytesLike>,
      storageURI: PromiseOrValue<string>,
      signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getMemoryNode(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMemoryTreeDetails(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSigner(overrides?: CallOverrides): Promise<BigNumber>;

    memoryNodeIdsOfMemoryTree(
      treeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    memoryNodesOfMemoryTree(
      treeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    memoryTreesOfBrain(
      brainAddress: PromiseOrValue<string>,
      brainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSigner(
      signer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addMemoryTree(
      brainAddress: PromiseOrValue<string>,
      brainId: PromiseOrValue<BigNumberish>,
      nodeHash: PromiseOrValue<BytesLike>,
      storageURI: PromiseOrValue<string>,
      signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addNode(
      parentNodeId: PromiseOrValue<BigNumberish>,
      nodeHash: PromiseOrValue<BytesLike>,
      storageURI: PromiseOrValue<string>,
      signature: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getMemoryNode(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMemoryTreeDetails(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSigner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    memoryNodeIdsOfMemoryTree(
      treeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    memoryNodesOfMemoryTree(
      treeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    memoryTreesOfBrain(
      brainAddress: PromiseOrValue<string>,
      brainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSigner(
      signer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
