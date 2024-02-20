import Address from "../../../@shared/domain/value-object/address.value-object"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import FindClientUseCase from "./find-client.usecase"

const client = new Client({
  id: new Id("1"),
  name: "Client One",
  email: "client@gmail.com",
  document: "doc",
  address: new Address({
    street: "street",
    number: "number",
    complement: "complement",
    city: "city",
    state: "state",
    zipCode: "000"
  })
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
    expect(result.document).toBe(client.document);
    expect(result.address.street).toBe(client.address.street);
    expect(result.address.number).toBe(client.address.number);
    expect(result.address.complement).toBe(client.address.complement);
    expect(result.address.city).toBe(client.address.city);
    expect(result.address.state).toBe(client.address.state);
    expect(result.address.zipCode).toBe(client.address.zipCode);
    expect(result.createdAt).toBe(client.createdAt);
    expect(result.updatedAt).toBe(client.updatedAt);
  });
});