import React, { useState } from 'react';
import { InfoIcon, PlusIcon, RotateCcwIcon, SearchIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import type { TranslationKey } from '../../data/translations';

export function AdminTranslations() {
  const { t, base, overrides, setOverride, resetOverride } = useI18n();
  const [query, setQuery] = useState('');
  const [onlyChanged, setOnlyChanged] = useState(false);

  const keys = Object.keys(base) as TranslationKey[];
  const q = query.trim().toLowerCase();
  const visible = keys.filter((k) => {
    if (onlyChanged && overrides[k] === undefined) return false;
    if (!q) return true;
    return k.toLowerCase().includes(q) || base[k].toLowerCase().includes(q) || (overrides[k] ?? '').toLowerCase().includes(q);
  });
  const changedCount = Object.keys(overrides).length;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{t('admin.texts.title')}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">{t('admin.texts.subtitle')}</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="inline-flex h-9 items-center rounded-full bg-ink px-3.5 text-sm font-medium text-white">{t('admin.texts.lang')}</span>
        <button type="button" disabled title={t('admin.texts.addLangHint')} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-muted ring-1 ring-inset ring-line">
          <PlusIcon className="h-4 w-4" />
          {t('admin.texts.addLang')}
        </button>
        <p className="text-xs text-muted">{t('admin.texts.addLangHint')}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-md">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('admin.texts.search')}
            aria-label={t('admin.texts.search')}
            className="h-10 w-full rounded-lg border border-line bg-surface pl-10 pr-3 text-sm text-ink outline-none focus:border-ink" />
          
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" checked={onlyChanged} onChange={(e) => setOnlyChanged(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--ink))]" />
          {t('admin.texts.onlyChanged')}
          <span className="tabular text-muted">({t('admin.texts.changed', { n: changedCount })})</span>
        </label>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted">
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t('admin.texts.vars')}
      </p>

      <div className="mt-3 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
        <div className="hidden grid-cols-[220px_1fr_1fr_40px] gap-4 border-b border-line px-5 py-3 text-xs font-medium text-muted md:grid">
          <span>{t('admin.texts.key')}</span>
          <span>{t('admin.texts.default')}</span>
          <span>{t('admin.texts.value')}</span>
          <span className="sr-only">{t('admin.texts.reset')}</span>
        </div>
        <ul className="divide-y divide-line" role="list">
          {visible.map((k) => {
            const changed = overrides[k] !== undefined;
            return (
              <li key={k} className="grid gap-2 px-5 py-3 md:grid-cols-[220px_1fr_1fr_40px] md:items-center md:gap-4">
                <code className="truncate font-mono text-xs text-muted" title={k}>{k}</code>
                <p className="hidden text-sm text-muted md:block">{base[k]}</p>
                <input
                  value={overrides[k] ?? base[k]}
                  onChange={(e) => setOverride(k, e.target.value)}
                  aria-label={k}
                  className={`h-9 w-full rounded-lg border px-3 text-sm text-ink outline-none focus:border-ink ${changed ? 'border-brand/50 bg-brand-soft' : 'border-line bg-surface'}`} />
                
                <button
                  type="button"
                  onClick={() => resetOverride(k)}
                  disabled={!changed}
                  aria-label={`${t('admin.texts.reset')} ${k}`}
                  title={t('admin.texts.reset')}
                  className="hidden h-9 w-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink disabled:invisible md:grid">
                  
                  <RotateCcwIcon className="h-4 w-4" />
                </button>
              </li>);

          })}
        </ul>
        {visible.length === 0 && <p className="px-5 py-10 text-center text-sm text-muted">{t('admin.texts.empty')}</p>}
      </div>
    </div>);

}