import React from 'react';
import { useI18n } from '../../contexts/I18nContext';

export function StockBadge({ stock }: {stock: number;}) {
  const { t } = useI18n();
  if (stock === 0) {
    return <span className="text-xs font-semibold text-danger">{t('stock.out')}</span>;
  }
  if (stock <= 15) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warn">
        <span className="h-1.5 w-1.5 rounded-full bg-warn" aria-hidden="true" />
        {t('stock.low', { n: stock })}
      </span>);

  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
      {t('stock.in', { n: stock })}
    </span>);

}