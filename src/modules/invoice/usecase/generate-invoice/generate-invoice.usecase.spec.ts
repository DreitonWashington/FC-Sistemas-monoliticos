import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const invoice = {
  id: "1",
  name: "Invoice One",
  document: "Invoice Document",
  street: "street",
  number: "12",
  complement: "complement",
  city: "city",
  state: "state",
  zipCode: "zipCode",
  items: [
    {
      name: "Product One",
      price: 12
    }
  ]
}
const MockRepository = () => {
  return {
    find: jest.fn(),
    generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  }
}

describe("GenerateInvoice usecase unit test", () => {

  it("Should generate a invoice", async () => {

    const input = {
      id: "1",
      name: "Invoice One",
      document: "Invoice Document",
      street: "street",
      number: "12",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "zipCode",
      items: [
        {
          id: "1",
          name: "Product One",
          price: 12
        }
      ]
    }

    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

    const result = await usecase.execute(input);

    expect(invoiceRepository.generate).toBeCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items[0].id).toBeDefined();
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
  });
});