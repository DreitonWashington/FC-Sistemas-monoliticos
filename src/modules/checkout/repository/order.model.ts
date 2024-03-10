import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Client from "../domain/client.entity";
import ClientModel from "./client.model";
import ProductModel from "./product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export default class OrderModel extends Model {
  
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;
  @BelongsTo(() => ClientModel)
  declare client: Client;
  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false })
  declare clientId: string;
  @HasMany(() => require("./product.model").default)
  declare products: import("./product.model").default[];
}