import Address from "../../../@shared/domain/value-object/address.value-object";
import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client UseCase unit test", () => {

  it("Should add a client", async () => {

    const clientRepository = MockRepository();
    const usecase = new AddClientUseCase(clientRepository);
    
    const input = {
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
    }

    const result = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe("Client One");
    expect(result.email).toBe("client@gmail.com");
    expect(result.document).toBe("doc");
    expect(result.address.street).toBe("street");
    expect(result.address.number).toBe("1");
    expect(result.address.complement).toBe("complement");
    expect(result.address.city).toBe("city");
    expect(result.address.state).toBe("state");
    expect(result.address.zipCode).toBe("000");
  });
});