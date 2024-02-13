import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product One",
  description: "Product One Description",
  salesPrice: 100,
});

const MockRepository = () => {
  return {
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  }
};

describe("Find product usecase unit test", () => {

  it("Should find a product", async () => {

    const productRepository = MockRepository();
    const usecase = new FindProductUseCase(productRepository);

    const result = await usecase.execute({productId: "1"});

    expect(productRepository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Product One");
    expect(result.description).toBe("Product One Description");
    expect(result.salesPrice).toBe(100);
  });
});