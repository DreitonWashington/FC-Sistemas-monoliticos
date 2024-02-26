import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceRepository from "./invoice.repository";
import Address from "../../@shared/domain/value-object/address.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoice-items.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Invoice repository test", () => {

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

  it("Should find a invoice", async () => {

    const address = new Address({
      street: "rua mario",
      number: "12",
      complement: "complement",
      city: "Jundiaí",
      state: "São Paulo",
      zipCode: "123133",
    })

    const item = new InvoiceItemsModel({
      id: "1",
      name: "Item One",
      price: 100
    })

    const item2 = new InvoiceItemsModel({
      id: "2",
      name: "Item Two",
      price: 200
    })

    await InvoiceModel.create({
      id: "1",
      name: "Invoice One",
      document: "Invoice Document",
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      items: [
        item,
        item2
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },{include: [{model: InvoiceItemsModel}]})

    const repository = new InvoiceRepository();
    const result = await repository.find("1")

    expect(result.id).toBeDefined();
    expect(result.name).toBe("Invoice One");
    expect(result.document).toBe("Invoice Document");
    expect(result.address.street).toBe(address.street);
    expect(result.address.number).toBe(address.number);
    expect(result.address.complement).toBe(address.complement);
    expect(result.address.city).toBe(address.city);
    expect(result.address.state).toBe(address.state);
    expect(result.address.zipCode).toBe(address.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id.id).toBe("1");
    expect(result.items[0].name).toBe("Item One");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].id.id).toBe("2");
    expect(result.items[1].name).toBe("Item Two");
    expect(result.items[1].price).toBe(200);
  });

  it("Should create a invoice", async () => {

    const address = new Address({
      street: "rua mario",
      number: "12",
      complement: "complement",
      city: "Jundiaí",
      state: "São Paulo",
      zipCode: "123133",
    })

    const item = new InvoiceItems({
      id: new Id("1"),
      name: "Item One",
      price: 100
    })

    const item2 = new InvoiceItems({
      name: "Item Two",
      price: 200
    })

    const invoiceRepository = new InvoiceRepository();

    const invoice = new Invoice({
      id: new Id("12"),
      name: "Invoice One",
      document: "Invoice Document",
      address: address,
      items: [
        item,
        item2
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await invoiceRepository.generate(invoice);
    const result = await invoiceRepository.find("12");

    
    expect(result.id).toBeDefined();
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id).toBeDefined();
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
  });
});