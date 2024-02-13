import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import FindClientUseCase from "./find-client.usecase"

const client = new Client({
  id: new Id("1"),
  name: "Client One",
  email: "client@gmail.com",
  address: "Av Mario"
})
const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
    add: jest.fn()
  }
}

describe("Find Client UseCase unit test", () => {

  it("Should find a client", async () => {

    const clientRepository = MockRepository();
    const usecase = new FindClientUseCase(clientRepository);

    const input = {id: "1"}
    const result = await usecase.execute(input);

    expect(clientRepository.find).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.address).toBe(client.address);
    expect(result.createdAt).toBe(client.createdAt);
    expect(result.updatedAt).toBe(client.updatedAt);
  });
});