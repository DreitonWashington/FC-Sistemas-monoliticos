import { Sequelize } from "sequelize-typescript";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";
import ProductModel from "./product.model";

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

  it("Should create a product", async () => {
    const productProps = {
      id: new Id("1"),
      name: "Product One",
      description: "Product One description",
      purchasePrice: 100,
      salesPrice: 90,
      stock: 10,
    };
    const product = new Product(productProps);
    const productRepository = new ProductRepository();
    await productRepository.add(product);
    
    const productDb = await ProductModel.findOne({
      where: { id: productProps.id.id },
    });

    expect(productProps.id.id).toEqual(productDb?.id);
    expect(productProps.name).toEqual(productDb.name);
    expect(productProps.description).toEqual(productDb.description);
    expect(productProps.purchasePrice).toEqual(productDb.purchasePrice);
    expect(productProps.salesPrice).toEqual(productDb.salesPrice);
    expect(productProps.stock).toEqual(productDb.stock);
  });

  it("Should find a Product", async () => {
    const productRepository = new ProductRepository();
    ProductModel.create({
      id: "1",
      name: "Product One",
      description: "Product One Description",
      purchasePrice: 100,
      salesPrice: 90,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await productRepository.find("1");

    expect(product.id.id).toEqual("1");
    expect(product.name).toEqual("Product One");
    expect(product.description).toEqual("Product One Description");
    expect(product.purchasePrice).toEqual(100);
    expect(product.salesPrice).toEqual(90);
    expect(product.stock).toEqual(10);

  });
});