export type OrderLine = {
  productId: string;
  code: string;
  name: string;
  qty: number;
  unitBase: number;
  tierPct: number;
  unitNet: number;
  lineTotal: number;
};

export type PaymentMethod = 'card' | 'credit';

export type OrderStatus = 'syncing' | 'confirmed' | 'shipped' | 'delivered' | 'rejected';

export type PaymentStatus = 'paid' | 'scheduled' | 'overdue';

export type Order = {
  id: string;
  odooRef: string | null;
  customerId: string;
  createdAt: string;
  lines: OrderLine[];
  subtotal: number;
  itbis: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  dueDate: string | null;
  status: OrderStatus;
};

export type SyncEntity = 'products' | 'inventory' | 'prices' | 'customers' | 'orders';

export type SyncLogEntry = {
  id: string;
  entity: SyncEntity;
  level: 'ok' | 'warning' | 'error';
  message: string;
  at: string;
};

export type CartItem = {
  productId: string;
  qty: number;
};