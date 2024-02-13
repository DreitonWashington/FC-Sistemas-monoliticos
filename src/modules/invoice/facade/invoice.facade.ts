import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
  findInvoiceUseCase: UseCaseInterface,
  generateInvoiceUseCase: UseCaseInterface,
}

export default class InvoiceFacade implements InvoiceFacadeInterface{

  private _findInvoiceUseCase: UseCaseInterface;
  private _generateInvoiceUseCase: UseCaseInterface;

  constructor(props: UseCaseProps) {
    this._findInvoiceUseCase = props.findInvoiceUseCase;
    this._generateInvoiceUseCase = props.generateInvoiceUseCase;
  }
  
  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
    return this._findInvoiceUseCase.execute(input);
  }
  generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateInvoiceUseCase.execute(input);
  }
}