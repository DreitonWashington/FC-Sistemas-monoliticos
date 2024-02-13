import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import { ProcessPaymentInputDto, ProcessPaymentOutputDto } from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
  
  private _transactionRepository: PaymentGateway;

  constructor(transactionRepository: PaymentGateway) {
    this._transactionRepository = transactionRepository;
  }
  
  async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
    const transaction = new Transaction({
      orderId: input.orderId,
      amount: input.amount,
    });

    transaction.process();
    const persisTransaction = await this._transactionRepository.save(transaction);

    return {
      transactionId: persisTransaction.id.id,
      orderId: persisTransaction.orderId,
      amount: persisTransaction.amount,
      status: persisTransaction.status,
      createdAt: persisTransaction.createdAt,
      updatedAt: persisTransaction.updatedAt,
    }
  }
  
}