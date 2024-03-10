import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/facade.factory";

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

  it("Should create a product", async () => {

    // const productRepository = new ProductRepository();
    // const addProductUseCase = new AddProductUseCase(productRepository);
    // const productFacade = new ProductAdmFacade({
    //   addUseCase: addProductUseCase,
    //   stockUseCase: undefined,
    // });

    const productFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Product One",
      description: "Product One Description",
      purchasePrice: 100,
      salesPrice: 90,
      stock: 10,
    }

    await productFacade.addProduct(input);
    const product = await ProductModel.findOne({ where: {id: "1"} });

    expect(product).toBeDefined();
    expect(product.id).toBe(input.id);
    expect(product.name).toBe(input.name);
    expect(product.description).toBe(input.description);
    expect(product.purchasePrice).toBe(input.purchasePrice);
    expect(product.salesPrice).toBe(input.salesPrice);
  });

  it("Should check stock product quantity", async () => {

    const productFacade = ProductAdmFacadeFactory.create();
    const input = {
      id: "1",
      name: "Product One",
      description: "Product One Description",
      purchasePrice: 100,
      salesPrice: 90,
      stock: 10,
    }

    await productFacade.addProduct(input);
    const result = await productFacade.checkStock({productId: "1"});

    expect(result.productId).toBe("1")
    expect(result.stock).toBe(10)
  });
});