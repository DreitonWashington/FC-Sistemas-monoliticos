import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "clients",
  timestamps: false,
})
export default class ClientModel extends Model {

  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;
  @Column({ allowNull: false })
  declare name: string;
  @Column({ allowNull: false })
  declare email: string;
  @Column({ allowNull: false })
  declare document: string;
  @Column({ allowNull: false })
  declare street: string;
  @Column({ allowNull: false })
  declare number: string;
  @Column({ allowNull: false })
  declare complement: string;
  @Column({ allowNull: false })
  declare city: string;
  @Column({ allowNull: false })
  declare state: string;
  @Column({ allowNull: false })
  declare zipCode: string;
  @HasMany(() => require("./order.model").default)
  declare orders: import("./order.model").default[];
}