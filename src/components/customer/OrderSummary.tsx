import React from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { formatDOP } from '../../utils/currency';

type OrderSummaryProps = {
  subtotal: number;
  savings?: number;
  itbis: number;
  total: number;
};

export function OrderSummary({ subtotal, savings = 0, itbis, total }: OrderSummaryProps) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
      <h2 className="text-sm font-semibold text-ink">{t('cart.summary')}</h2>
      <dl className="tabular mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">{t('summary.subtotal')}</dt>
          <dd className="font-medium text-ink">{formatDOP(subtotal)}</dd>
        </div>
        {savings > 0 &&
        <div className="flex justify-between">
            <dt className="text-success">{t('summary.savings')}</dt>
            <dd className="font-medium text-success">−{formatDOP(savings)}</dd>
          </div>
        }
        <div className="flex justify-between">
          <dt className="text-muted">{t('summary.itbis')}</dt>
          <dd className="font-medium text-ink">{formatDOP(itbis)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <dt className="font-semibold text-ink">{t('summary.total')}</dt>
          <dd className="text-xl font-bold tracking-tight text-ink">{formatDOP(total)}</dd>
        </div>
      </dl>
    </div>);

}