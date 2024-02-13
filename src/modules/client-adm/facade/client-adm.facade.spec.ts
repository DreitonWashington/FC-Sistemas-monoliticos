import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

describe("ClientAdmFacade test", () => {

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

  it("Should create a client", async () => {

    const clientRepository = new ClientRepository();
    const addUseCase = new AddClientUseCase(clientRepository);
    const facade = new ClientAdmFacade({
      addUseCase: addUseCase,
      findUseCase: undefined
    });

    const input = {
      id: "1",
      name: "Client One",
      email: "client@gmail.com",
      address: "Av Mario",
    };

    await facade.add(input)
    const client = await ClientModel.findOne({ where: {id: "1"} });

    expect(client.id).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
  });

  it("Should find a client", async () => {

    const facade = ClientAdmFacadeFactory.create();

    await ClientModel.create({
      id: "1",
      name: "Client One",
      email: "client@gmail.com",
      address: "Av Mario",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientDb = await facade.find({id: "1"});

    expect(clientDb.id).toBe("1");
    expect(clientDb.name).toBe("Client One");
    expect(clientDb.email).toBe("client@gmail.com");
    expect(clientDb.address).toBe("Av Mario");
  });
});