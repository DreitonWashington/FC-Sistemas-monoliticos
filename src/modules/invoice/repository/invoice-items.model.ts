import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export default class InvoiceItemsModel extends Model {

  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;
  @Column({ allowNull: false })
  declare name: string;
  @Column({ allowNull: false })
  declare price: number;
  @ForeignKey(() => InvoiceModel)
  declare invoiceId: string;
  @BelongsTo(() => InvoiceModel)
  declare invoice: InvoiceModel;
  
}