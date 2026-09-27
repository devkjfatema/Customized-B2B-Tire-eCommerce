import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCartIcon, Trash2Icon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { QuantityStepper } from '../../components/customer/QuantityStepper';
import { OrderSummary } from '../../components/customer/OrderSummary';
import { formatDOP } from '../../utils/currency';
import { buildLine, nextTier, totals } from '../../utils/pricing';

export function Cart() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { cart, products, currentCustomer, setCartQty } = useStore();
  if (!currentCustomer) return null;

  const rows = cart.
  map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? { product, line: buildLine(product, currentCustomer, item.qty) } : null;
  }).
  filter((r): r is NonNullable<typeof r> => r !== null);
  const sum = totals(rows.map((r) => r.line));
  const units = cart.reduce((s, i) => s + i.qty, 0);

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface ring-1 ring-line">
          <ShoppingCartIcon className="h-6 w-6 text-muted" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-ink">{t('cart.empty.title')}</h1>
        <p className="mt-1.5 text-sm text-muted">{t('cart.empty.body')}</p>
        <Link to="/catalogo" className="mt-6 inline-flex h-11 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-strong">
          {t('cart.empty.cta')}
        </Link>
      </div>);

  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{t('cart.title')}</h1>
        <p className="text-sm text-muted">{t('cart.items', { n: units })}</p>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-10">
        <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface ring-1 ring-line" role="list">
          <AnimatePresence initial={false}>
            {rows.map(({ product, line }) => {
              const next = nextTier(product, line.qty);
              const canReach = next && next.minQty <= product.stock;
              return (
                <motion.li
                  key={product.id}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="flex gap-3 p-4 md:gap-4">
                  
                  <Link to={`/producto/${product.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F2F2F0] md:h-24 md:w-24">
                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-muted">{product.code} · {product.ply} {product.construction}</p>
                        <Link to={`/producto/${product.id}`} className="block truncate text-base font-bold text-ink">{product.size}</Link>
                      </div>
                      <p className="tabular shrink-0 text-base font-bold text-ink">{formatDOP(line.lineTotal)}</p>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span className="tabular text-muted">{t('cart.unit', { price: formatDOP(line.unitNet) })}</span>
                      {line.tierPct > 0 &&
                      <span className="rounded-full bg-success-soft px-2 py-0.5 font-semibold text-success">{t('cart.tier', { pct: line.tierPct })}</span>
                      }
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                      <QuantityStepper value={line.qty} max={product.stock} onChange={(n) => setCartQty(product.id, n)} />
                      <div className="flex items-center gap-1">
                        {canReach && next &&
                        <button
                          type="button"
                          onClick={() => setCartQty(product.id, next.minQty)}
                          className="h-9 whitespace-nowrap rounded-lg px-2.5 text-xs font-semibold text-success hover:bg-success-soft">
                          
                            {t('cart.nudge', { n: next.minQty - line.qty, pct: next.discountPct })}
                          </button>
                        }
                        <button
                          type="button"
                          onClick={() => setCartQty(product.id, 0)}
                          aria-label={`${t('cart.remove')} ${product.name}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-danger">
                          
                          <Trash2Icon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>);

            })}
          </AnimatePresence>
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary {...sum} />
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="mt-4 h-12 w-full rounded-xl bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-brand-strong">
            
            {t('cart.checkout')}
          </button>
          <Link to="/catalogo" className="mt-3 block text-center text-sm font-medium text-muted hover:text-ink">{t('cart.continue')}</Link>
        </aside>
      </div>
    </div>);

}