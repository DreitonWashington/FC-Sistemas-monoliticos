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
      address: "Av Mario"
    }

    const result = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe("Client One");
    expect(result.email).toBe("client@gmail.com");
    expect(result.address).toBe("Av Mario");
  });
});