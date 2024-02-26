import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product One",
  description: "Product One Description",
  purchasePrice: 100,
  salesPrice: 90,
  stock: 10,
});

const MockRepository = () => {
  return{
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  }
}

describe("Check-stock usecase unit test", () => {

  it("Should check a product", async () => {

    const productRepository = MockRepository();
    const checkStockUseCase = new CheckStockUseCase(productRepository);

    const input = {
      productId: "1",
    };
    const result = await checkStockUseCase.execute(input);

    expect(productRepository.find).toHaveBeenCalled()
    expect(result.productId).toEqual("1");
    expect(result.stock).toEqual(10);
  });
});