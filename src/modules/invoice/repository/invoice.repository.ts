import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  
  async generate(invoice: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: invoice.id.id || new Id(),
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => {
        return new InvoiceItemsModel({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    }, {include: [{model: InvoiceItemsModel}]})
  }

  async find(id: string): Promise<Invoice> {
    const result = await InvoiceModel.findOne({
      where: {id: id},
      include: [{
        model: InvoiceItemsModel
      }],
    })

    return new Invoice({
      id: new Id(result.id),
      name: result.name,
      document: result.document,
      address: new Address({
        street: result.street,
        number: result.number,
        complement: result.complement,
        city: result.city,
        state: result.state,
        zipCode: result.zipCode
      }),
      items: result.items.map((item) => {
        return new InvoiceItems({
          id: new Id(item.id),
          name: item.name,
          price: item.price})
      }),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    })
  }
  
}

