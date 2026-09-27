export type ProductCategory = 'street' | 'scooter' | 'offroad' | 'classic' | 'auto';

export type PriceTier = {
  minQty: number;
  discountPct: number;
};

export type Product = {
  id: string;
  odooId: number;
  code: string;
  size: string;
  ply: string;
  construction: 'TL' | 'TT';
  category: ProductCategory;
  brand: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  basePrice: number;
  tiers: PriceTier[];
};