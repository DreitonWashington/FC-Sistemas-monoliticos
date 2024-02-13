import Address from "../../../@shared/domain/value-object/address.value-object"
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity"
import InvoiceItems from "../../domain/invoice-items.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address({
  street: "Street One",
  number: "1",
  complement: "Street One Complement",
  state: "São Paulo",
  city: "Jundiaí",
  zipCode: "12"
});

const invoiceItemOne = new InvoiceItems({
  id: new Id("1"),
  name: "Product One",
  price: 100,
});

const invoiceItemTwo = new InvoiceItems({
  id: new Id("1"),
  name: "Product Two",
  price: 200,
});

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice One",
  document: "Invoice One Document",
  address: address,
  items: [invoiceItemOne, invoiceItemTwo],
});

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn(),
  }
}

describe("FindInvoice usecase unit test", () => {

  it("Should find an invoice", async () => {

    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id).toBe(invoice.items[1].id.id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
    expect(result.total).toBe(invoice.items[0].price + invoice.items[1].price);
  });
});

