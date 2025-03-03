export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantityInStock: number;
  platformType: Platform;
}

export enum Platform {
  PC = 0,
  PlayStation = 1,
  Xbox = 2,
  Nintendo = 3,
  Mobile = 4
}
