import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import type { OrderStatus, PaymentStatus } from '../types/order';

const ORDER_TONE: Record<OrderStatus, string> = {
  syncing: 'bg-info-soft text-info',
  confirmed: 'bg-canvas text-ink ring-1 ring-inset ring-line',
  shipped: 'bg-warn-soft text-warn',
  delivered: 'bg-success-soft text-success',
  rejected: 'bg-danger-soft text-danger'
};

const PAYMENT_TONE: Record<PaymentStatus, string> = {
  paid: 'text-success',
  scheduled: 'text-info',
  overdue: 'text-danger'
};

export function OrderStatusBadge({ status }: {status: OrderStatus;}) {
  const { t } = useI18n();
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${ORDER_TONE[status]}`}>
      {status === 'syncing' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-info" aria-hidden="true" />}
      {t(`order.status.${status}`)}
    </span>);

}

export function PaymentStatusText({ status }: {status: PaymentStatus;}) {
  const { t } = useI18n();
  return <span className={`whitespace-nowrap text-xs font-semibold ${PAYMENT_TONE[status]}`}>{t(`payment.status.${status}`)}</span>;
}