export type TaxIdType = 'RNC' | 'CEDULA';

export type PaymentTerm = 0 | 15 | 30 | 45 | 60;

export type CardOnFile = {
  brand: 'Visa' | 'Mastercard';
  last4: string;
  expiry: string;
  tokenStatus: 'active' | 'expired';
};

export type Customer = {
  id: string;
  odooId: number;
  name: string;
  taxIdType: TaxIdType;
  taxId: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  priceList: string;
  listDiscountPct: number;
  extraDiscountPct: number;
  paymentTerm: PaymentTerm;
  termApprovedBy: string | null;
  creditLimit: number;
  balance: number;
  card: CardOnFile | null;
  active: boolean;
};

export type TermRequest = {
  id: string;
  customerId: string;
  kind: 'term' | 'discount';
  requestedTerm: PaymentTerm | null;
  requestedDiscountPct: number | null;
  note: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
};