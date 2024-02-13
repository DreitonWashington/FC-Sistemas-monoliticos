import Id from "../../../@shared/domain/value-object/id.value-object"
import Transaction from "../../domain/transaction"
import ProcessPaymentUseCase from "./process-payment.usecase"

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction))
  }
}

const transaction = new Transaction({
  id: new Id("1"),
  amount: 100,
  orderId: "1",
  status: "approved"
})

const MockRepositoryDeclined = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction2))
  }
}

const transaction2 = new Transaction({
  id: new Id("1"),
  amount: 50,
  orderId: "1",
  status: "declined",
})

describe("ProcessPayment usecase unit test", () => {

  it("Should approve a transaction", async () => {

    const paymentRepository = MockRepository();
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    
    const input = {
      orderId: "1",
      amount: 100
    }

    const result = await usecase.execute(input);

    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.transactionId).toBe(transaction.id.id);
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(100);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toEqual(transaction.createdAt);
    expect(result.updatedAt).toEqual(transaction.updatedAt);
  });

  it("Should decline a transaction", async () => {

    const paymentRepository = MockRepositoryDeclined();
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    
    const input = {
      orderId: "1",
      amount: 50
    }

    const result = await usecase.execute(input);

    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.transactionId).toBe(transaction2.id.id);
    expect(result.status).toBe("declined");
    expect(result.amount).toBe(50);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toEqual(transaction2.createdAt);
    expect(result.updatedAt).toEqual(transaction2.updatedAt);
  });
});