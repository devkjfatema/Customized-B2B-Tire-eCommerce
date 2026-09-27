import type { TaxIdType } from '../types/customer';

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function expectedLength(type: TaxIdType): number {
  return type === 'RNC' ? 9 : 11;
}

export function isValidTaxId(type: TaxIdType, raw: string): boolean {
  return digitsOnly(raw).length === expectedLength(type);
}

export function formatTaxId(type: TaxIdType, raw: string): string {
  const d = digitsOnly(raw);
  if (type === 'RNC' && d.length === 9) return `${d.slice(0, 1)}-${d.slice(1, 3)}-${d.slice(3, 8)}-${d.slice(8)}`;
  if (type === 'CEDULA' && d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 10)}-${d.slice(10)}`;
  return d;
}