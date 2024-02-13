import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductsUseCase from "./find-all-products.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product One",
  description: "Product One Description",
  salesPrice: 100,
});

const product2 = new Product({
  id: new Id("2"),
  name: "Product Two",
  description: "Product Two Description",
  salesPrice: 200,
});

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2]))
  }
}

describe("Find all products use case unit test", () => {

  it("Should find all products", async () => {

    const productRepository = MockRepository();
    const usecase = new FindAllProductsUseCase(productRepository);

    const result = await usecase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result.products.length).toBe(2);
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