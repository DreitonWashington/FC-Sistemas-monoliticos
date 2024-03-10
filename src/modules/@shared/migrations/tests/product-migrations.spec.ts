import { Sequelize } from "sequelize-typescript";
import { migrator } from "../config-migration/migrator";
import ProductModel from "../../../product-adm/repository/product.model";
import ProductCatModel from "../../../store-catalog/repository/product.model";
import { Umzug } from "umzug";

describe("Product-Migrations test", () => {

  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    

    sequelize.addModels([ProductModel, ProductCatModel]);
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

  it("Should create an Product", async () => {
    await ProductModel.create({
      id: "1",
      name: "Product Test umzug",
      description: "Product One Description",
      purchasePrice: 101,
      salesPrice: 90,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await ProductModel.findOne({where: {id: "1"}});

    expect(product.id).toBe("1");
    expect(product.name).toBe("Product Test umzug");
    expect(product.description).toBe("Product One Description");
    expect(product.purchasePrice).toBe(101);
    expect(product.salesPrice).toBe(90);
    expect(product.stock).toBe(10);
  });

  it("Should find an Product", async () => {
    await ProductModel.create({
      id: "1",
      name: "Product Test umzug",
      description: "Product One Description",
      purchasePrice: 101,
      salesPrice: 90,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await ProductCatModel.findOne({where: {id: "1"}});

    expect(product.id).toBe("1");
    expect(product.name).toBe("Product Test umzug");
    expect(product.description).toBe("Product One Description");
    expect(product.salesPrice).toBe(90);
  });
});