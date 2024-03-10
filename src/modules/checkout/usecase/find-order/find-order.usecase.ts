import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { FindOrderInputDto, FindOrderOutputDto } from "./find-order.dto";

export default class FindOrderUseCase implements UseCaseInterface{

  private _checkoutRepository: CheckoutGateway

  constructor(repository: CheckoutGateway) {
    this._checkoutRepository = repository;
  }

  async execute(input: FindOrderInputDto): Promise<FindOrderOutputDto> {
    const order = await this._checkoutRepository.findOrder(input.id);

    return {
      orderId: order.id.id,
      clientId: order.client.id.id,
      products: order.products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      }))
    }
  }
}