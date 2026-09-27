import React from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { formatDOP } from '../../utils/currency';
import { tierFor, unitPriceAt } from '../../utils/pricing';
import type { Product } from '../../types/catalog';
import type { Customer } from '../../types/customer';

type TierTableProps = {
  product: Product;
  customer: Customer;
  qty: number;
  onPick: (qty: number) => void;
};

export function TierTable({ product, customer, qty, onPick }: TierTableProps) {
  const { t } = useI18n();
  const active = tierFor(product, qty);
  const tiers = [...product.tiers].sort((a, b) => a.minQty - b.minQty);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-ink">{t('tiers.title')}</h2>
        <p className="text-xs text-muted">{t('tiers.hint')}</p>
      </div>
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface" role="list">
        {tiers.map((tier, i) => {
          const next = tiers[i + 1];
          const isActive = tier.minQty === active.minQty;
          const disabled = tier.minQty > product.stock;
          const range = next ?
          t('tiers.range', { min: tier.minQty, max: next.minQty - 1 }) :
          t('tiers.rangeOpen', { min: tier.minQty });
          return (
            <li key={tier.minQty}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(Math.max(tier.minQty, 1))}
                aria-pressed={isActive}
                className={`grid w-full grid-cols-[1fr_auto_4.5rem] items-center gap-3 px-4 py-3 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                isActive ? 'bg-brand-soft' : 'hover:bg-canvas'}`
                }>
                
                <span className="flex items-center gap-2">
                  <span className={`h-4 w-4 rounded-full border-2 ${isActive ? 'border-brand bg-brand shadow-[inset_0_0_0_2px_white]' : 'border-line'}`} aria-hidden="true" />
                  <span className="text-sm font-medium text-ink">{range}</span>
                </span>
                <span className="tabular text-sm font-semibold text-ink">{formatDOP(unitPriceAt(product, customer, tier))}</span>
                <span className={`tabular text-right text-xs font-semibold ${tier.discountPct > 0 ? 'text-success' : 'text-muted'}`}>
                  {tier.discountPct > 0 ? `−${tier.discountPct}%` : t('tiers.base')}
                </span>
              </button>
            </li>);

        })}
      </ul>
      <p className="mt-2 text-xs text-muted">{t('tiers.note', { list: customer.priceList })}</p>
    </div>);

}