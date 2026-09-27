import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, CheckIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { StockBadge } from './StockBadge';
import { formatDOP } from '../../utils/currency';
import { unitPriceAt } from '../../utils/pricing';
import type { Product } from '../../types/catalog';
import type { Customer } from '../../types/customer';

type ProductCardProps = {
  product: Product;
  customer: Customer;
  inCartQty: number;
  onQuickAdd: () => void;
};

export function ProductCard({ product, customer, inCartQty, onQuickAdd }: ProductCardProps) {
  const { t } = useI18n();
  const tiers = [...product.tiers].sort((a, b) => a.minQty - b.minQty);
  const price = unitPriceAt(product, customer, tiers[0]);
  const best = tiers[tiers.length - 1];
  const bestPrice = unitPriceAt(product, customer, best);
  const out = product.stock === 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <Link to={`/producto/${product.id}`} className="flex flex-1 flex-col focus:outline-none" aria-label={product.name}>
        <div className="relative aspect-square bg-[#F2F2F0]">
          <img src={product.image} alt="" className={`h-full w-full object-cover ${out ? 'opacity-50 grayscale' : ''}`} />
          <span className="absolute left-2.5 top-2.5 rounded-md bg-surface/90 px-1.5 py-0.5 text-[11px] font-semibold text-ink">
            {product.construction}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-3 md:p-4">
          <p className="text-xs font-medium text-muted">{product.code} · {product.ply}</p>
          <h3 className="mt-0.5 text-[17px] font-bold leading-tight tracking-tight text-ink md:text-lg">{product.size}</h3>
          <div className="mt-1.5"><StockBadge stock={product.stock} /></div>
          <div className="mt-auto pt-3">
            <p className="tabular text-base font-bold text-ink">{formatDOP(price)}</p>
            <p className="tabular mt-0.5 text-[11px] leading-snug text-success">
              {t('product.from', { price: formatDOP(bestPrice), qty: best.minQty })}
            </p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={onQuickAdd}
        disabled={out}
        aria-label={t('product.quickAdd', { name: product.name })}
        className={`absolute right-2.5 top-2.5 grid h-9 min-w-9 place-items-center rounded-full px-2 text-xs font-bold transition-[background-color,transform] duration-150 active:scale-95 disabled:hidden ${
        inCartQty > 0 ? 'bg-ink text-white' : 'bg-brand text-white hover:bg-brand-strong'}`
        }>
        
        {inCartQty > 0 ?
        <span className="flex items-center gap-1"><CheckIcon className="h-3.5 w-3.5" />{inCartQty}</span> :

        <PlusIcon className="h-4 w-4" />
        }
      </button>
    </article>);

}