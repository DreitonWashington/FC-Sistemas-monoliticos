import express, { Express, json } from "express";
import { Sequelize } from "sequelize-typescript";
import { clientRoute } from "./routes/client.route";
import { migrator } from "../../modules/@shared/migrations/config-migration/migrator";
import { Umzug } from "umzug";
import { productRoute } from "./routes/product.route";
import { checkoutRoute } from "./routes/checkout.route";
import OrderModel from "../../modules/checkout/repository/order.model";
import ClientModel from "../../modules/checkout/repository/client.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../../modules/invoice/repository/invoice-items.model";
import ProductCatalogModel from "../../modules/store-catalog/repository/product.model";
import ProductCheckoutModel from "../../modules/checkout/repository/product.model";
import ProductAdmModel from "../../modules/product-adm/repository/product.model";
import ClientAdmModel from "../../modules/client-adm/repository/client.model";
import { invoiceRoute } from "./routes/invoice.route";

export const app: Express = express();

app.use(express.json());
app.use("/clients", clientRoute);
app.use("/products", productRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;
export let migration: Umzug<any>;

async function db() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  //sequelize.addModels([, ProductModel]);
  // await sequelize.sync({force: true});
  // sequelize.addModels([ClientModel]);
  await sequelize.addModels([OrderModel, ClientModel, ProductCatalogModel, ProductCheckoutModel, 
    ProductAdmModel, TransactionModel, InvoiceModel, InvoiceItemsModel, ClientAdmModel]);
  migration = migrator(sequelize);
  await migration.up();
}

db();