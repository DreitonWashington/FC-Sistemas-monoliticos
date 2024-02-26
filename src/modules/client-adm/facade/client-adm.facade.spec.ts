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
      document: "doc",
      address: {
        street: "street",
        number: "1",
        complement: "complement",
        city: "city",
        state: "state",
        zipCode: "000",
      },
    };

    await facade.add(input)
    const client = await ClientModel.findOne({ where: {id: "1"} });

    expect(client.id).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.street).toBe(input.address.street);
    expect(client.number).toBe(input.address.number);
    expect(client.complement).toBe(input.address.complement);
    expect(client.city).toBe(input.address.city);
    expect(client.state).toBe(input.address.state);
    expect(client.zipCode).toBe(input.address.zipCode);
  });

  it("Should find a client", async () => {

    const facade = ClientAdmFacadeFactory.create();

    await ClientModel.create({
      id: "1",
      name: "Client One",
      email: "client@gmail.com",
      document: "doc",
      street: "street",
      number: "1",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientDb = await facade.find({id: "1"});

    expect(clientDb.id).toBe("1");
    expect(clientDb.name).toBe("Client One");
    expect(clientDb.email).toBe("client@gmail.com");
    expect(clientDb.document).toBe("doc");
    expect(clientDb.address.street).toBe("street");
    expect(clientDb.address.number).toBe("1");
    expect(clientDb.address.complement).toBe("complement");
    expect(clientDb.address.city).toBe("city");
    expect(clientDb.address.state).toBe("state");
    expect(clientDb.address.zipCode).toBe("000");
  });
});