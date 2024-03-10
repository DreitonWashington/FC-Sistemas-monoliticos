import { Sequelize } from "sequelize-typescript";
import OrderModel from "./order.model";
import ClientModel from "./client.model";
import ProductModel from "./product.model";
import { Umzug } from "umzug";
import { migrator } from "../../@shared/migrations/config-migration/migrator";
import Client from "../domain/client.entity";
import OrderRepository from "./order.repository";
import Order from "../domain/order.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import Address from "../../@shared/domain/value-object/address.value-object";

describe("Client repository test", () => {

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel, ClientModel, ProductModel]);
    migration = migrator(sequelize)
    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it("Should create an order", async () => {
    const orderRepository = new OrderRepository();

    await ClientModel.create({
      id: "1",
      name: "Client One",
      email: "email@gmail.com",
      document: "123",
      street: "street",
      number: "1",
      complement: "comp",
      city: "city",
      state: "state",
      zipCode: "zip"
    })

    const client = await ClientModel.findOne({where: {id: "1"}})
    
    const order = new Order({
      id: new Id("1"),
      client: new Client({
        id: new Id(client.id),
        name: client.name,
        email: client.email,
        document: client.document,
        address: new Address({
          street: client.street,
          number:  client.number,
          complement:  client.complement,
          city:  client.city,
          state:  client.state,
          zipCode:  client.zipCode,
        }),
      }),
      products: [
        new Product({
          id: new Id("1"),
          name: "Product One",
          description: "Product Description",
          salesPrice: 12,
        }),
      ]
    });
    await orderRepository.addOrder(order);

    const result = await OrderModel.findOne({where: {id: "1"},include: {model: ProductModel}});

    expect(result.id).toBe("1");
    expect(result.clientId).toBe("1");
    expect(result.products).toHaveLength(1);
    expect(result.products[0].id).toBe("1");
    expect(result.products[0].name).toBe("Product One");
    expect(result.products[0].description).toBe("Product Description");
    expect(result.products[0].salesPrice).toBe(12);
  });
});