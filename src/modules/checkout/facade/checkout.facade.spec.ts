import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../@shared/migrations/config-migration/migrator";
import OrderModel from "../repository/order.model";
// import OrderRepository from "../repository/order.repository";
// import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
// import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
// import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
// import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
// import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
// import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
// import CheckoutFacade from "./checkout.facade";
import ClientModel from "../../client-adm/repository/client.model";
import CheckoutClientModel from "../repository/client.model"
import ProductCatalogModel from "../../store-catalog/repository/product.model";
import ProductAdmModel from "../../product-adm/repository/product.model"
import ProductCheckoutModel from "../repository/product.model"
import TransactionModel from "../../payment/repository/transaction.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemsModel from "../../invoice/repository/invoice-items.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import OrderRepository from "../repository/order.repository";
// import Product from "../domain/product.entity";
// import ProductModel from "../repository/product.model";


describe("Checkout facade test", () => {
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
      ProductAdmModel, TransactionModel, InvoiceModel, InvoiceItemsModel, CheckoutClientModel])
 
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

  it("Should place an order", async () => {
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
    })

    await ProductAdmModel.create({
      id: "1",
      name: "Product One",
      description: "Product Description",
      salesPrice: 102,
      purchasePrice: 101,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const orderRepository = new OrderRepository();
    // const clientFacade = ClientAdmFacadeFactory.create();
    // const productFacade = ProductAdmFacadeFactory.create();
    // const invoiceFacade = InvoiceFacadeFactory.create();
    // const catalogFacade = StoreCatalogFacadeFactory.create();
    // const paymentFacade = PaymentFacadeFactory.create();
    // const usecase = new PlaceOrderUseCase(clientFacade, productFacade, catalogFacade, orderRepository, invoiceFacade, paymentFacade);

    // const checkoutFacade = new CheckoutFacade({
    //   placeOrderUsecase: usecase,
    // });

    const checkoutFacade = CheckoutFacadeFactory.create();

    const input = {
      clientId: "1",
      products: [
        {
          productId: "1"
        }
      ]
    };

    const result = await checkoutFacade.placeOrder(input);
    const order = await checkoutFacade.findOrder({id: result.id})

    expect(order.clientId).toBe("1");
    expect(order.products).toHaveLength(1);
    expect(result.products[0].productId).toBe("1");
  });
});