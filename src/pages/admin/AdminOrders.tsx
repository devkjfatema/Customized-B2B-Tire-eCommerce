import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { OrderStatusBadge, PaymentStatusText } from '../../components/StatusBadges';
import { formatDate, formatDateTime, formatDOP } from '../../utils/currency';
import type { OrderStatus } from '../../types/order';
import type { TranslationKey } from '../../data/translations';

const FILTERS: ('all' | OrderStatus)[] = ['all', 'syncing', 'confirmed', 'shipped', 'delivered', 'rejected'];

export function AdminOrders() {
  const { t } = useI18n();
  const { orders, customers } = useStore();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const list = orders.filter((o) => filter === 'all' || o.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{t('admin.orders.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('admin.orders.subtitle')}</p>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => {
          const count = f === 'all' ? orders.length : orders.filter((o) => o.status === f).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`h-9 shrink-0 whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors duration-150 ${
              filter === f ? 'bg-ink text-white' : 'bg-surface text-ink ring-1 ring-inset ring-line hover:bg-canvas'}`
              }>
              
              {f === 'all' ? t('filter.all') : t(`order.status.${f}` as TranslationKey)}
              <span className={`tabular ml-1.5 ${filter === f ? 'text-white/60' : 'text-muted'}`}>{count}</span>
            </button>);

        })}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-surface ring-1 ring-line">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">{t('col.order')}</th>
              <th scope="col" className="px-3 py-3 font-medium">{t('col.customer')}</th>
              <th scope="col" className="px-3 py-3 font-medium">{t('col.date')}</th>
              <th scope="col" className="px-3 py-3 font-medium">{t('col.payment')}</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">{t('col.total')}</th>
              <th scope="col" className="px-5 py-3 font-medium">{t('col.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((o) => {
              const c = customers.find((x) => x.id === o.customerId);
              return (
                <tr key={o.id}>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-ink">{o.id}</p>
                    <p className="tabular text-xs text-muted">{o.odooRef ?? '—'}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    {c ? <Link to={`/admin/clientes/${c.id}`} className="font-medium text-ink hover:underline">{c.name}</Link> : '—'}
                  </td>
                  <td className="tabular px-3 py-3.5 text-muted" title={formatDateTime(o.createdAt)}>{formatDate(o.createdAt)}</td>
                  <td className="px-3 py-3.5">
                    <p className="text-ink">{o.paymentMethod === 'card' ? t('pay.method.card') : t('pay.method.credit')}</p>
                    {o.status !== 'rejected' &&
                    <p>
                        <PaymentStatusText status={o.paymentStatus} />
                        {o.paymentStatus === 'scheduled' && o.dueDate && <span className="text-xs text-muted"> · {formatDate(o.dueDate, 'd MMM')}</span>}
                      </p>
                    }
                  </td>
                  <td className="tabular px-3 py-3.5 text-right font-semibold text-ink">{formatDOP(o.total)}</td>
                  <td className="px-5 py-3.5"><OrderStatusBadge status={o.status} /></td>
                </tr>);

            })}
          </tbody>
        </table>
        {list.length === 0 && <p className="px-5 py-10 text-center text-sm text-muted">{t('admin.orders.empty')}</p>}
      </div>
    </div>);

}