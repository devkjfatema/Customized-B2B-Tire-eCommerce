import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, TrendingDownIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { StockBadge } from '../../components/customer/StockBadge';
import { TierTable } from '../../components/customer/TierTable';
import { QuantityStepper } from '../../components/customer/QuantityStepper';
import { formatDOP } from '../../utils/currency';
import { nextTier, tierFor, unitPriceAt } from '../../utils/pricing';

export function ProductDetail() {
  const { t } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, currentCustomer, cart, setCartQty } = useStore();
  const product = products.find((p) => p.id === id);
  const inCart = cart.find((i) => i.productId === id)?.qty ?? 0;
  const [qty, setQty] = useState(inCart || 1);

  if (!product || !currentCustomer) {
    return (
      <div className="py-20 text-center">
        <p className="font-semibold text-ink">{t('product.notFound')}</p>
        <Link to="/catalogo" className="mt-3 inline-block text-sm font-semibold text-brand">{t('product.back')}</Link>
      </div>);

  }

  const out = product.stock === 0;
  const tier = tierFor(product, qty);
  const unit = unitPriceAt(product, currentCustomer, tier);
  const next = nextTier(product, qty);
  const nextReachable = next && next.minQty <= product.stock;

  const commit = () => {
    setCartQty(product.id, qty);
    toast.success(inCart ? t('toast.updated') : t('toast.added', { name: product.size }), {
      action: { label: t('toast.viewCart'), onClick: () => navigate('/carrito') }
    });
  };

  const specs = [
  { label: t('spec.size'), value: product.size },
  { label: t('spec.ply'), value: product.ply },
  { label: t('spec.construction'), value: t(`construction.${product.construction}`) },
  { label: t('spec.brand'), value: product.brand },
  { label: t('spec.ref'), value: `#${product.odooId}` }];


  return (
    <div className="pb-16 md:pb-0">
      <Link to="/catalogo" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeftIcon className="h-4 w-4" />
        {t('product.back')}
      </Link>

      <div className="mt-4 grid gap-6 md:mt-6 md:grid-cols-2 md:gap-10 lg:gap-14">
        <div className="md:sticky md:top-24 md:self-start">
          <div className="overflow-hidden rounded-2xl bg-[#F2F2F0] ring-1 ring-line">
            <img src={product.image} alt={product.name} className={`aspect-square w-full object-cover ${out ? 'opacity-50 grayscale' : ''}`} />
          </div>
          <dl className="mt-5 hidden grid-cols-2 gap-x-6 gap-y-3 md:grid">
            {specs.map((s) =>
            <div key={s.label} className="border-t border-line pt-3">
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-ink">{s.value}</dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <p className="text-sm font-medium text-muted">{product.brand} · {product.code}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">{product.size}</h1>
          <p className="mt-1 text-sm font-medium text-ink">{product.ply} · {t(`construction.${product.construction}`)}</p>
          <div className="mt-3"><StockBadge stock={product.stock} /></div>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{product.description}</p>

          <div className="mt-7">
            <TierTable product={product} customer={currentCustomer} qty={qty} onPick={(n) => setQty(Math.min(n, product.stock))} />
          </div>

          {!out &&
          <div className="mt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="mb-1.5 text-sm font-medium text-ink">{t('product.qty')}</p>
                  <QuantityStepper value={qty} max={product.stock} onChange={setQty} size="lg" />
                  <p className="mt-1.5 text-xs text-muted">{t('product.maxStock', { n: product.stock })}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">{t('product.lineTotal', { qty })}</p>
                  <p className="tabular text-2xl font-bold tracking-tight text-ink">{formatDOP(unit * qty)}</p>
                  <p className="tabular text-xs text-muted">{t('cart.unit', { price: formatDOP(unit) })}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-success-soft px-4 py-3 text-sm text-success">
                {nextReachable && next ?
              <button type="button" onClick={() => setQty(next.minQty)} className="flex w-full items-start gap-2 text-left font-medium">
                    <TrendingDownIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {t('product.nudge', {
                    n: next.minQty - qty,
                    price: formatDOP(unitPriceAt(product, currentCustomer, next)),
                    pct: next.discountPct
                  })}
                    </span>
                  </button> :

              <p className="font-medium">{t('product.bestTier')}</p>
              }
              </div>
            </div>
          }

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 md:hidden">
            {specs.map((s) =>
            <div key={s.label} className="border-t border-line pt-3">
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-ink">{s.value}</dd>
              </div>
            )}
          </dl>

          <div className="fixed inset-x-0 bottom-[64px] z-20 border-t border-line bg-surface p-3 md:static md:mt-7 md:border-0 md:bg-transparent md:p-0">
            <button
              type="button"
              onClick={commit}
              disabled={out}
              className="h-12 w-full rounded-xl bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-brand-strong disabled:bg-line disabled:text-muted">
              
              {out ? t('product.outOfStock') : inCart ? t('product.updateCart') : `${t('product.addToCart')} · ${formatDOP(unit * qty)}`}
            </button>
          </div>
        </div>
      </div>
    </div>);

}