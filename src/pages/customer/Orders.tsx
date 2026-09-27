import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarClockIcon, ChevronRightIcon, PackageIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { OrderStatusBadge, PaymentStatusText } from '../../components/StatusBadges';
import { formatDate, formatDOP } from '../../utils/currency';

export function Orders() {
  const { t } = useI18n();
  const { orders, currentCustomer } = useStore();
  if (!currentCustomer) return null;

  const mine = orders.filter((o) => o.customerId === currentCustomer.id);
  const upcoming = mine.
  filter((o) => o.paymentStatus === 'scheduled' && o.dueDate && o.status !== 'rejected').
  sort((a, b) => a.dueDate! < b.dueDate! ? -1 : 1);
  const cardLabel = currentCustomer.card ? `${currentCustomer.card.brand} •••• ${currentCustomer.card.last4}` : '';

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{t('orders.title')}</h1>

      {upcoming.length > 0 &&
      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-info-soft p-4 text-info">
          <CalendarClockIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">{t('orders.upcoming')}</p>
            <p className="tabular mt-0.5">
              {t('orders.upcomingBody', {
              amount: formatDOP(upcoming[0].total),
              card: cardLabel,
              date: formatDate(upcoming[0].dueDate!, "d 'de' MMMM")
            })}
            </p>
          </div>
        </div>
      }

      {mine.length === 0 ?
      <div className="mt-6 rounded-2xl bg-surface px-6 py-16 text-center ring-1 ring-line">
          <PackageIcon className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 font-semibold text-ink">{t('orders.empty.title')}</p>
          <p className="mt-1 text-sm text-muted">{t('orders.empty.body')}</p>
        </div> :

      <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl bg-surface ring-1 ring-line" role="list">
          {mine.map((o) => {
          const units = o.lines.reduce((s, l) => s + l.qty, 0);
          return (
            <li key={o.id}>
                <Link to={`/pedidos/${o.id}`} className="flex items-center gap-4 p-4 transition-colors duration-150 hover:bg-canvas md:px-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{o.id}</p>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">
                      {formatDate(o.createdAt)} · {t('orders.items', { n: units })} · {o.odooRef ?? t('orders.pendingOdoo')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular font-bold text-ink">{formatDOP(o.total)}</p>
                    <div className="mt-0.5 flex flex-col items-end">
                      {o.status !== 'rejected' && <PaymentStatusText status={o.paymentStatus} />}
                      {o.paymentStatus === 'scheduled' && o.dueDate && o.status !== 'rejected' &&
                    <span className="text-xs text-muted">{t('orders.due', { date: formatDate(o.dueDate, 'd MMM') })}</span>
                    }
                    </div>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted" />
                </Link>
              </li>);

        })}
        </ul>
      }
    </div>);

}