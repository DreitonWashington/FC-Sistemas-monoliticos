import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe("Product-Adm Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should find a product", async () => {
    await ProductModel.create({
      id: "1",
      name: "Product One",
      description: "Product One Description",
      salesPrice: 100,
    });

    const facade = StoreCatalogFacadeFactory.create();
    const result = await facade.find({id: "1"});

    expect(result.id).toBe("1");
    expect(result.name).toBe("Product One");
    expect(result.description).toBe("Product One Description");
    expect(result.salesPrice).toBe(100);

  });

  it("Should find all products", async () => {
    await ProductModel.create({
      id: "1",
      name: "Product One",
      description: "Product One Description",
      salesPrice: 100,
    });

    await ProductModel.create({
      id: "2",
      name: "Product Two",
      description: "Product Two Description",
      salesPrice: 200,
    });

    const facade = StoreCatalogFacadeFactory.create();
    const result = await facade.findAll();

    expect(result.products[0].id).toBe("1");
    expect(result.products[0].name).toBe("Product One");
    expect(result.products[0].description).toBe("Product One Description");
    expect(result.products[0].salesPrice).toBe(100);
    expect(result.products[1].id).toBe("2");
    expect(result.products[1].name).toBe("Product Two");
    expect(result.products[1].description).toBe("Product Two Description");
    expect(result.products[1].salesPrice).toBe(200);
  });
});