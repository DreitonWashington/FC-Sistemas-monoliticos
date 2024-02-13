import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceFacade from "./invoice.facade";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoiceFacade test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should generate an invoice", async () => {

    const input = {
      name: "Invoice One",
      document: "Incoice Document",
      street: "street",
      number: "number",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "zipCode",
      items: [
        {
          id: "1",
          name: "Item One",
          price: 100,
        },
        {
          id: "2",
          name: "Item Two",
          price: 400,
        }
      ]
    }

    const facade = InvoiceFacadeFactory.create();

    const result = await facade.generate(input);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items.length).toBe(2);
  });

  it("Should find an invoice", async () => {
    const invoice = await InvoiceModel.create({
      id: "1",
      name: "Invoice One",
      document: "Incoice Document",
      street: "street",
      number: "number",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "zipCode",
      items: [
        {
          id: "1",
          name: "Item One",
          price: 100,
        },
        {
          id: "2",
          name: "Item Two",
          price: 400,
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {include: [{model: InvoiceItemsModel}]})

    const invoiceRepository = new InvoiceRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);
    const facade = new InvoiceFacade({
      findInvoiceUseCase: usecase,
      generateInvoiceUseCase: undefined,
    })

    const input = {
      id: "1"
    }

    const result = await facade.find(input);

    expect(result.id).toBe(invoice.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.street);
    expect(result.address.number).toBe(invoice.number);
    expect(result.address.complement).toBe(invoice.complement);
    expect(result.address.city).toBe(invoice.city);
    expect(result.address.state).toBe(invoice.state);
    expect(result.address.zipCode).toBe(invoice.zipCode);
    expect(result.items.length).toBe(2);
  });
});