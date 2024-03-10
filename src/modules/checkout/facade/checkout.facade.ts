import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import CheckoutFacadeInterface, { FindOrderInput, FindOrderOutput, PlaceOrderInput, PlaceOrderOutput } from "./checkout.facade.interface";

export interface UseCaseProps {
  placeOrderUsecase: UseCaseInterface,
  findOrderUseCase: UseCaseInterface,
}

export default class CheckoutFacade implements CheckoutFacadeInterface {

  private _placeOrderUseCase: UseCaseInterface;
  private _findOrderUseCase: UseCaseInterface;

  constructor(props: UseCaseProps) {
    this._placeOrderUseCase = props.placeOrderUsecase;
    this._findOrderUseCase = props.findOrderUseCase;
  }

  placeOrder(input: PlaceOrderInput): Promise<PlaceOrderOutput> {
    return this._placeOrderUseCase.execute(input)
  }

  findOrder(input: FindOrderInput): Promise<FindOrderOutput> {
    return this._findOrderUseCase.execute(input)
  }
}