import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Product repository test", () => {

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

    const productRepository = new ProductRepository();
    const products = await productRepository.findAll();

    expect(products.length).toBe(2);
    expect(products[0].id.id).toBe("1");
    expect(products[0].name).toBe("Product One");
    expect(products[0].description).toBe("Product One Description");
    expect(products[0].salesPrice).toBe(100);
    expect(products[1].id.id).toBe("2");
    expect(products[1].name).toBe("Product Two");
    expect(products[1].description).toBe("Product Two Description");
    expect(products[1].salesPrice).toBe(200);
  });

  it("Should find a product", async () => {
    await ProductModel.create({
      id: "1",
      name: "Product One",
      description: "Product One Description",
      salesPrice: 100,
    });

    const productRepository = new ProductRepository();
    const product = await productRepository.find("1");

    expect(product.id.id).toBe("1");
    expect(product.name).toBe("Product One");
    expect(product.description).toBe("Product One Description");
    expect(product.salesPrice).toBe(100);
  });
});