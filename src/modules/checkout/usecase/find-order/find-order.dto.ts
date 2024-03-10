export interface FindOrderInputDto {
  id: string;
}

export interface FindOrderOutputDto {
  orderId: string;
  clientId: string;
  products: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];
}