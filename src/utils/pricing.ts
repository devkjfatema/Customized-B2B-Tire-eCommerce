import type { PriceTier, Product } from '../types/catalog';
import type { Customer } from '../types/customer';
import type { OrderLine } from '../types/order';

export const ITBIS_RATE = 0.18;

export function tierFor(product: Product, qty: number): PriceTier {
  const sorted = [...product.tiers].sort((a, b) => a.minQty - b.minQty);
  let current = sorted[0];
  for (const tier of sorted) {
    if (qty >= tier.minQty) current = tier;
  }
  return current;
}

export function nextTier(product: Product, qty: number): PriceTier | null {
  const sorted = [...product.tiers].sort((a, b) => a.minQty - b.minQty);
  return sorted.find((tier) => tier.minQty > qty) ?? null;
}

export function customerBase(product: Product, customer: Customer): number {
  return product.basePrice * (1 - customer.listDiscountPct / 100) * (1 - customer.extraDiscountPct / 100);
}

export function unitPriceAt(product: Product, customer: Customer, tier: PriceTier): number {
  return round(customerBase(product, customer) * (1 - tier.discountPct / 100));
}

export function buildLine(product: Product, customer: Customer, qty: number): OrderLine {
  const tier = tierFor(product, qty);
  const unitNet = unitPriceAt(product, customer, tier);
  return {
    productId: product.id,
    code: product.code,
    name: product.name,
    qty,
    unitBase: round(customerBase(product, customer)),
    tierPct: tier.discountPct,
    unitNet,
    lineTotal: round(unitNet * qty)
  };
}

export function totals(lines: OrderLine[]) {
  const subtotal = round(lines.reduce((sum, l) => sum + l.lineTotal, 0));
  const savings = round(lines.reduce((sum, l) => sum + (l.unitBase - l.unitNet) * l.qty, 0));
  const itbis = round(subtotal * ITBIS_RATE);
  return { subtotal, savings, itbis, total: round(subtotal + itbis) };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}