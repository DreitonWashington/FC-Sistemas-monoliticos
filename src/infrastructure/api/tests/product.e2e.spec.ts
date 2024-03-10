import { Sequelize } from "sequelize-typescript"
import  ProductModel  from "../../../modules/product-adm/repository/product.model";
import { app } from "../express";
import request from "supertest";
import { migrator } from "../../../modules/@shared/migrations/config-migration/migrator";
import { Umzug } from "umzug";

describe("Teste e2e product", () => {

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    

    sequelize.addModels([ProductModel]);
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

  it("Should create a product", async () => {
    await request(app)
      .post("/products")
      .send({
        id: "1",
        name: "Product One",
        description: "Product One Description",
        purchasePrice: 10,
        salesPrice: 9,
        stock: 5,
      });
    
    const response = await ProductModel.findOne({where: {id: "1"}});

    expect(response.id).toBeDefined();
    expect(response.name).toBe("Product One");
    expect(response.description).toBe("Product One Description");
    expect(response.purchasePrice).toBe(10);
    expect(response.salesPrice).toBe(9);
    expect(response.stock).toBe(5);
  });
});