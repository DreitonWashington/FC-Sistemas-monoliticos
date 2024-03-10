import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import ClientModel from "./client.model";
import OrderModel from "./order.model";
import ProductModel from "./product.model";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    const t = await OrderModel.create({
      id: order.id.id || new Id(),
      clientId: order.client.id.id,
      products: order.products.map((product) => {
          return new ProductModel({
            id: product.id.id,
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
            orderId: order.id.id,
          })
        }
      )
    },
    {
     include: [{model: ProductModel}] 
    });

  }

  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({where: {id: id}});
    const client = await ClientModel.findOne({where: {id: order.clientId}});
    const products = await ProductModel.findAll({where: {orderId: id}});
    order.products = products;

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(client.id),
        name: client.name,
        email: client.email,
        document: client.document,
        address: new Address({
          street: client.street,
          number: client.number,
          complement: client.complement,
          city: client.city,
          state: client.state,
          zipCode: client.zipCode,
        })
      }),
      products: order.products.map((product) => new Product({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice
      }))
    })
  }
}