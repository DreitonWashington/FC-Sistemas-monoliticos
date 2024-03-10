import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";

@Table({
  tableName: "order_products",
  timestamps: false,
})
export default class ProductModel extends Model {

  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;
  @Column({ allowNull: false })
  declare name: string;
  @Column({ allowNull: false })
  declare description: string;
  @Column({ allowNull: false })
  declare salesPrice: number;
  @ForeignKey(() => OrderModel)
  declare orderId: string;
  @BelongsTo(() => OrderModel)
  declare order: OrderModel;
}