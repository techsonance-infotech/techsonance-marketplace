export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered';

export interface Order {
  orderId: string;
  customerName: string;
  status: OrderStatus;
  amount: number;
  action: 'Ship Now' | 'View';
}