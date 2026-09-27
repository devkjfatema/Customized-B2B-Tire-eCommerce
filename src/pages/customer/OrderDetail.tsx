import React from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangleIcon, ArrowLeftIcon, CheckCircle2Icon, Loader2Icon, RotateCcwIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { OrderStatusBadge } from '../../components/StatusBadges';
import { OrderSummary } from '../../components/customer/OrderSummary';
import { formatDate, formatDateTime, formatDOP } from '../../utils/currency';
import type { OrderStatus } from '../../types/order';
import type { TranslationKey } from '../../data/translations';

const STEPS: {key: TranslationKey;reachedAt: OrderStatus[];}[] = [
{ key: 'order.timeline.received', reachedAt: ['syncing', 'confirmed', 'shipped', 'delivered'] },
{ key: 'order.timeline.registered', reachedAt: ['confirmed', 'shipped', 'delivered'] },
{ key: 'order.timeline.shipped', reachedAt: ['shipped', 'delivered'] },
{ key: 'order.timeline.delivered', reachedAt: ['delivered'] }];


export function OrderDetail() {
  const { t } = useI18n();
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { orders, addToCart, products, currentCustomer } = useStore();
  const order = orders.find((o) => o.id === id && o.customerId === currentCustomer?.id);

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="font-semibold text-ink">{t('order.notFound')}</p>
        <Link to="/pedidos" className="mt-3 inline-block text-sm font-semibold text-brand">{t('order.back')}</Link>
      </div>);

  }

  const isNew = params.get('nuevo') === '1';
  const cardLabel = currentCustomer?.card ? `${currentCustomer.card.brand} •••• ${currentCustomer.card.last4}` : '';

  const reorder = () => {
    order.lines.forEach((l) => {
      const p = products.find((x) => x.id === l.productId);
      if (p && p.stock > 0) addToCart(l.productId, Math.min(l.qty, p.stock));
    });
    toast.success(t('toast.updated'));
    navigate('/carrito');
  };

  return (
    <div>
      <Link to="/pedidos" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeftIcon className="h-4 w-4" />
        {t('order.back')}
      </Link>

      {isNew &&
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="mt-4 flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-success">
        
          <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">{t('order.success.title')}</p>
            <p className="mt-0.5 text-sm">{t('order.success.body')}</p>
          </div>
        </motion.div>
      }

      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{order.id}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {t('order.date', { date: formatDateTime(order.createdAt) })}
            {' · '}
            {order.odooRef ?
            t('order.odooRef', { ref: order.odooRef }) :
            order.status === 'syncing' ?
            <span className="inline-flex items-center gap-1 text-info"><Loader2Icon className="h-3 w-3 animate-spin" />{t('orders.pendingOdoo')}</span> :
            null}
          </p>
        </div>
        <button type="button" onClick={reorder} className="inline-flex h-10 items-center gap-2 rounded-lg bg-surface px-3.5 text-sm font-semibold text-ink ring-1 ring-line hover:bg-canvas">
          <RotateCcwIcon className="h-4 w-4" />
          {t('order.reorder')}
        </button>
      </div>

      {order.status === 'rejected' ?
      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-danger-soft p-4 text-sm text-danger">
          <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{t('order.rejected')}</p>
        </div> :

      <ol className="mt-6 grid grid-cols-4 gap-2" aria-label={t('order.progress')}>
          {STEPS.map((step) => {
          const done = step.reachedAt.includes(order.status);
          return (
            <li key={step.key}>
                <div className={`h-1.5 rounded-full transition-colors duration-300 ${done ? 'bg-brand' : 'bg-line'}`} />
                <p className={`mt-2 text-[11px] font-medium leading-tight md:text-xs ${done ? 'text-ink' : 'text-muted'}`}>{t(step.key)}</p>
              </li>);

        })}
        </ol>
      }

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-10">
        <section aria-labelledby="lines-h">
          <h2 id="lines-h" className="text-base font-semibold text-ink">{t('order.lines')}</h2>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl bg-surface ring-1 ring-line" role="list">
            {order.lines.map((l) =>
            <li key={l.productId} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{l.name}</p>
                  <p className="tabular mt-0.5 text-xs text-muted">
                    {l.qty} × {formatDOP(l.unitNet)}
                    {l.tierPct > 0 && <span className="ml-2 font-semibold text-success">{t('cart.tier', { pct: l.tierPct })}</span>}
                  </p>
                </div>
                <p className="tabular shrink-0 font-semibold text-ink">{formatDOP(l.lineTotal)}</p>
              </li>
            )}
          </ul>
        </section>

        <aside className="space-y-4">
          <OrderSummary subtotal={order.subtotal} itbis={order.itbis} total={order.total} />
          {order.status !== 'rejected' &&
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
              <h2 className="text-sm font-semibold text-ink">{t('order.payment')}</h2>
              <p className="mt-2 text-sm text-ink">
                {order.paymentMethod === 'card' ?
              t('order.paidCard') :
              order.paymentStatus === 'paid' ?
              t('order.creditPaid') :
              t('order.creditDue', { date: formatDate(order.dueDate!, "d 'de' MMMM yyyy"), card: cardLabel })}
              </p>
            </div>
          }
        </aside>
      </div>
    </div>);

}