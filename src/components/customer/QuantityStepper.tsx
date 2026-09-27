import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

type QuantityStepperProps = {
  value: number;
  max: number;
  min?: number;
  onChange: (qty: number) => void;
  size?: 'sm' | 'lg';
};

export function QuantityStepper({ value, max, min = 1, onChange, size = 'sm' }: QuantityStepperProps) {
  const { t } = useI18n();
  const h = size === 'lg' ? 'h-12' : 'h-9';
  const btn = size === 'lg' ? 'w-12' : 'w-9';
  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div className={`inline-flex ${h} items-stretch overflow-hidden rounded-lg border border-line bg-surface`}>
      <button
        type="button"
        aria-label={t('qty.decrease')}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className={`${btn} grid place-items-center text-ink transition-colors duration-150 hover:bg-canvas disabled:text-muted/50 disabled:hover:bg-transparent`}>
        
        <MinusIcon className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={t('qty.label')}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(clamp(n));
        }}
        className={`tabular w-12 border-x border-line bg-transparent text-center font-semibold text-ink outline-none [appearance:textfield] focus:bg-canvas ${size === 'lg' ? 'text-lg' : 'text-sm'} [&::-webkit-inner-spin-button]:appearance-none`} />
      
      <button
        type="button"
        aria-label={t('qty.increase')}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className={`${btn} grid place-items-center text-ink transition-colors duration-150 hover:bg-canvas disabled:text-muted/50 disabled:hover:bg-transparent`}>
        
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>);

}