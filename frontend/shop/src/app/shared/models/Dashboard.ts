export interface UserDashboard {
  totalOrders: number;
  totalSpent: number;
  totalGamesBought: number;
  platformSales: {
    platform: string;
    salesCount: number;
  }[];
}
