import { Sequelize } from "sequelize-typescript";
import { app } from "../express";
import request from "supertest";
import ClientModel from "../../../modules/client-adm/repository/client.model";
import { Umzug } from "umzug";
import { migrator } from "../../../modules/@shared/migrations/config-migration/migrator";

describe("Teste e2e client", () => {

  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    })
    
    sequelize.addModels([ClientModel])
    migration = migrator(sequelize)
    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it("Should create a client", async () => {
    await request(app)
      .post("/clients")
      .send({
        id: "1",
        name: "Lucas",
        email: "lk@gmail.com",
        document: "123",
        address: {
          street: "street",
          number: "12",
          complement: "comp",
          city: "city",
          state: "state",
          zipCode: "zip"
        },
      });
    
    const client = await ClientModel.findOne({where: {id: "1"}});
    
    expect(client.id).toBeDefined();
    expect(client.name).toBe("Lucas");
    expect(client.email).toBe("lk@gmail.com")
    expect(client.document).toBe("123");
    expect(client.street).toBe("street");
    expect(client.number).toBe("12");
    expect(client.complement).toBe("comp");
    expect(client.city).toBe("city");
    expect(client.state).toBe("state");
    expect(client.zipCode).toBe("zip");
  });

  it("Should find a client", async () => {
    await ClientModel.create({
      id: "1",
      name: "Lucas",
      email: "lk@gmail.com",
      document: "123",
      street: "street",
      number: "12",
      complement: "comp",
      city: "city",
      state: "state",
      zipCode: "zip",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .get("/clients/1")
      .send();
    
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Lucas");
    expect(response.body.email).toBe("lk@gmail.com")
    expect(response.body.document).toBe("123");
    expect(response.body.address.street).toBe("street");
    expect(response.body.address.number).toBe("12");
    expect(response.body.address.complement).toBe("comp");
    expect(response.body.address.city).toBe("city");
    expect(response.body.address.state).toBe("state");
    expect(response.body.address.zipCode).toBe("zip");
  });
});