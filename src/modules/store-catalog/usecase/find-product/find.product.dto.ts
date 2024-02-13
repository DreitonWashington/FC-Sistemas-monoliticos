export interface FindProductInputDto {
  productId: string;
}

export interface FindProductOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}