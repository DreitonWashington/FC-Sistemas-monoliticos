import Address from "../../../@shared/domain/value-object/address.value-object"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import Order from "../../domain/order.entity"
import Product from "../../domain/product.entity"
import FindOrderUseCase from "./find-order.usecase"

const order = new Order({
  id: new Id("1"),
  client: new Client({
    id: new Id("1"),
    name: "Client One",
    email: "client@gmail.com",
    document: "doc",
    address: new Address({
      street: "street",
      number: "number",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "000"
    }),
  }),
  status: "pending",
  products: [
    new Product({
      id: new Id("1"),
      name: "Product One",
      description: "Product One description",
      salesPrice: 12
    })
  ]
});

const mockRepository = () => {
  return {
    addOrder: jest.fn(),
    findOrder: jest.fn().mockReturnValue(Promise.resolve(order))
  }
};

describe("Find Order UseCase unit test", () => {

  it("Should find an order", async () => {

    const repository = mockRepository();
    const usecase = new FindOrderUseCase(repository);
    const input = {
      id: "1"
    }

    const result = await usecase.execute(input);

    expect(result.orderId).toBe("1");
    expect(result.clientId).toBe("1");
    expect(result.products).toHaveLength(1);
    expect(result.products[0].name).toBe("Product One");
    expect(result.products[0].description).toBe("Product One description");
    expect(result.products[0].salesPrice).toBe(12);
  });
});