import { Sequelize } from "sequelize-typescript";
import { app } from "../express";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../../modules/@shared/migrations/config-migration/migrator";
import OrderModel from "../../../modules/checkout/repository/order.model";
import ClientModel from "../../../modules/checkout/repository/client.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../../../modules/invoice/repository/invoice-items.model";
import ProductCatalogModel from "../../../modules/store-catalog/repository/product.model";
import ProductCheckoutModel from "../../../modules/checkout/repository/product.model";
import ProductAdmModel from "../../../modules/product-adm/repository/product.model";
import ClientAdmModel from "../../../modules/client-adm/repository/client.model";
import CheckoutFacadeFactory from "../../../modules/checkout/factory/checkout.facade.factory";

describe("Teste e2e invoice", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel, ClientModel, ProductCatalogModel, ProductCheckoutModel, 
      ProductAdmModel, TransactionModel, InvoiceModel, InvoiceItemsModel, ClientAdmModel])
 
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

  it("Should find an invocie", async () => {
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
      zipCode: "zip",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductAdmModel.create({
      id: "1",
      name: "Product One",
      description: "Product Description",
      salesPrice: 112,
      purchasePrice: 101,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const checkoutFacade = CheckoutFacadeFactory.create();
    const order = await checkoutFacade.placeOrder({
      clientId: "1",
      products: [{productId: "1"}]
    });

    const result = await request(app)
      .get(`/invoice/${order.invoiceId}`)
      .send()

    expect(result.body.id).toBeDefined();
    expect(result.body.name).toBe("Client One");
    expect(result.body.document).toBe("123");
    expect(result.body.items).toHaveLength(1);
    expect(result.body.items[0].id).toBe("1");
    expect(result.body.items[0].name).toBe("Product One");
    expect(result.body.items[0].price).toBe(112);
    expect(result.body.total).toBe(112);
  });
});