import { Sequelize } from "sequelize-typescript";
import ClientModel from "./client.model";
import Client from "../domain/client.entity";
import ClientRepository from "./client.repository";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Client repository test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should find a client", async () => {

    const client = await ClientModel.create({
      id: "1",
      name: "client One",
      email: "client@gmail.com",
      address: "av mario",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();
    const result = await clientRepository.find("1");

    expect(result.id.id).toBe(client.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.address).toBe(client.address);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });

  it("Should create a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "client One",
      email: "client@gmail.com",
      address: "av mario",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();
    await clientRepository.add(client);

    const clientDb = await ClientModel.findOne({where: {id: "1"}});

    expect(clientDb.id).toBeDefined();
    expect(clientDb.id).toEqual(client.id.id);
    expect(clientDb.name).toEqual(client.name);
    expect(clientDb.email).toEqual(client.email);
    expect(clientDb.address).toEqual(client.address);
    expect(clientDb.createdAt).toEqual(client.createdAt);
    expect(clientDb.updatedAt).toEqual(client.updatedAt);
  });
});