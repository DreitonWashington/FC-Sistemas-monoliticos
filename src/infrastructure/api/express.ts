import express, { Express, json } from "express";
import { Sequelize } from "sequelize-typescript";
import { clientRoute } from "./routes/client.route";
import ClientModel from "../../modules/client-adm/repository/client.model";
import { migrator } from "../../modules/@shared/migrations/config-migration/migrator";
import { Umzug } from "umzug";

export const app: Express = express();

app.use(express.json());
app.use("/client", clientRoute);

export let sequelize: Sequelize;
export let migration: Umzug<any>;

async function db() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  // sequelize.addModels([CustomerModel, ProductModel]);
  // await sequelize.sync({force: true});
  // sequelize.addModels([ClientModel]);
  // migration = migrator(sequelize)
  // await migration.up()
}
db();