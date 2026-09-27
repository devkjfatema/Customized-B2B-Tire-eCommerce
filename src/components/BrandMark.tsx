import React from 'react';
import { useI18n } from '../contexts/I18nContext';

type BrandMarkProps = {subtitle?: string;inverted?: boolean;};

export function BrandMark({ subtitle, inverted = false }: BrandMarkProps) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2.5">
      <div
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-full bg-brand">
        
        <div className="h-4 w-4 rounded-full border-[3px] border-white" />
      </div>
      <div className="leading-tight">
        <p className={`text-[15px] font-bold tracking-tight ${inverted ? 'text-white' : 'text-ink'}`}>{t('app.name')}</p>
        {subtitle && <p className={`text-xs ${inverted ? 'text-white/70' : 'text-muted'}`}>{subtitle}</p>}
      </div>
    </div>);

}