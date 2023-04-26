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

export interface PongComputeManagerInterface extends utils.Interface {
  functions: {
    "addComputeOption(uint256,uint256)": FunctionFragment;
    "claimAsto(address,uint256)": FunctionFragment;
    "completeCompute(uint256)": FunctionFragment;
    "completer()": FunctionFragment;
    "computeOptions(uint256)": FunctionFragment;
    "computeRequestManager()": FunctionFragment;
    "getComputeOptionDisbursement(uint256,uint256)": FunctionFragment;
    "getComputeOptionSLA(uint256,uint64,uint64)": FunctionFragment;
    "getComputeOptionUnitCost(uint256,uint64)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "totalComputeOptions()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateComputeOption(uint256,bool,uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addComputeOption"
      | "claimAsto"
      | "completeCompute"
      | "completer"
      | "computeOptions"
      | "computeRequestManager"
      | "getComputeOptionDisbursement"
      | "getComputeOptionSLA"
      | "getComputeOptionUnitCost"
      | "owner"
      | "renounceOwnership"
      | "supportsInterface"
      | "totalComputeOptions"
      | "transferOwnership"
      | "updateComputeOption"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addComputeOption",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "claimAsto",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "completeCompute",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "completer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "computeOptions",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "computeRequestManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getComputeOptionDisbursement",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getComputeOptionSLA",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getComputeOptionUnitCost",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "totalComputeOptions",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateComputeOption",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addComputeOption",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimAsto", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "completeCompute",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "completer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "computeOptions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeRequestManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComputeOptionDisbursement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComputeOptionSLA",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComputeOptionUnitCost",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalComputeOptions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateComputeOption",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

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

export interface PongComputeManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PongComputeManagerInterface;

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
    addComputeOption(
      unitCost: PromiseOrValue<BigNumberish>,
      unitMinutes: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimAsto(
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    completeCompute(
      computeId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    completer(overrides?: CallOverrides): Promise<[string]>;

    computeOptions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, BigNumber] & {
        enabled: boolean;
        unitCost: BigNumber;
        unitSeconds: BigNumber;
      }
    >;

    computeRequestManager(overrides?: CallOverrides): Promise<[string]>;

    getComputeOptionDisbursement(
      index: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string[], BigNumber[]] & { addresses: string[]; amounts: BigNumber[] }
    >;

    getComputeOptionSLA(
      index: PromiseOrValue<BigNumberish>,
      startTime: PromiseOrValue<BigNumberish>,
      units: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { maxTime: BigNumber }>;

    getComputeOptionUnitCost(
      index: PromiseOrValue<BigNumberish>,
      units: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { cost: BigNumber }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    totalComputeOptions(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateComputeOption(
      computeId: PromiseOrValue<BigNumberish>,
      active: PromiseOrValue<boolean>,
      unitCost: PromiseOrValue<BigNumberish>,
      unitMinutes: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addComputeOption(
    unitCost: PromiseOrValue<BigNumberish>,
    unitMinutes: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimAsto(
    to: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  completeCompute(
    computeId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  completer(overrides?: CallOverrides): Promise<string>;

  computeOptions(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [boolean, BigNumber, BigNumber] & {
      enabled: boolean;
      unitCost: BigNumber;
      unitSeconds: BigNumber;
    }
  >;

  computeRequestManager(overrides?: CallOverrides): Promise<string>;

  getComputeOptionDisbursement(
    index: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string[], BigNumber[]] & { addresses: string[]; amounts: BigNumber[] }
  >;

  getComputeOptionSLA(
    index: PromiseOrValue<BigNumberish>,
    startTime: PromiseOrValue<BigNumberish>,
    units: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getComputeOptionUnitCost(
    index: PromiseOrValue<BigNumberish>,
    units: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  totalComputeOptions(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateComputeOption(
    computeId: PromiseOrValue<BigNumberish>,
    active: PromiseOrValue<boolean>,
    unitCost: PromiseOrValue<BigNumberish>,
    unitMinutes: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addComputeOption(
      unitCost: PromiseOrValue<BigNumberish>,
      unitMinutes: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimAsto(
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    completeCompute(
      computeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    completer(overrides?: CallOverrides): Promise<string>;

    computeOptions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, BigNumber] & {
        enabled: boolean;
        unitCost: BigNumber;
        unitSeconds: BigNumber;
      }
    >;

    computeRequestManager(overrides?: CallOverrides): Promise<string>;

    getComputeOptionDisbursement(
      index: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string[], BigNumber[]] & { addresses: string[]; amounts: BigNumber[] }
    >;

    getComputeOptionSLA(
      index: PromiseOrValue<BigNumberish>,
      startTime: PromiseOrValue<BigNumberish>,
      units: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getComputeOptionUnitCost(
      index: PromiseOrValue<BigNumberish>,
      units: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    totalComputeOptions(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateComputeOption(
      computeId: PromiseOrValue<BigNumberish>,
      active: PromiseOrValue<boolean>,
      unitCost: PromiseOrValue<BigNumberish>,
      unitMinutes: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
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
    addComputeOption(
      unitCost: PromiseOrValue<BigNumberish>,
      unitMinutes: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimAsto(
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    completeCompute(
      computeId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    completer(overrides?: CallOverrides): Promise<BigNumber>;

    computeOptions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    computeRequestManager(overrides?: CallOverrides): Promise<BigNumber>;

    getComputeOptionDisbursement(
      index: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getComputeOptionSLA(
      index: PromiseOrValue<BigNumberish>,
      startTime: PromiseOrValue<BigNumberish>,
      units: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getComputeOptionUnitCost(
      index: PromiseOrValue<BigNumberish>,
      units: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalComputeOptions(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateComputeOption(
      computeId: PromiseOrValue<BigNumberish>,
      active: PromiseOrValue<boolean>,
      unitCost: PromiseOrValue<BigNumberish>,
      unitMinutes: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addComputeOption(
      unitCost: PromiseOrValue<BigNumberish>,
      unitMinutes: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimAsto(
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    completeCompute(
      computeId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    completer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    computeOptions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    computeRequestManager(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getComputeOptionDisbursement(
      index: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getComputeOptionSLA(
      index: PromiseOrValue<BigNumberish>,
      startTime: PromiseOrValue<BigNumberish>,
      units: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getComputeOptionUnitCost(
      index: PromiseOrValue<BigNumberish>,
      units: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalComputeOptions(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateComputeOption(
      computeId: PromiseOrValue<BigNumberish>,
      active: PromiseOrValue<boolean>,
      unitCost: PromiseOrValue<BigNumberish>,
      unitMinutes: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
