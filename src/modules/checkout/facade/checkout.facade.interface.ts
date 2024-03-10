export interface PlaceOrderInput {
  clientId: string,
  products: {
    productId: string
  }[]
}

export interface PlaceOrderOutput {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}

export interface FindOrderInput {
  id: string;
}

export interface FindOrderOutput {
  orderId: string,
  clientId: string,
  products: {
    id: string,
    name: string,
    description: string,
    salesPrice: number,
  }[]
}

export default interface CheckoutFacadeInterface {
  placeOrder(input: PlaceOrderInput): Promise<PlaceOrderOutput>,
  findOrder(input: FindOrderInput): Promise<FindOrderOutput>
}