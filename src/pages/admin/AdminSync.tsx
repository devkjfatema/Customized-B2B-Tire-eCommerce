import React from 'react';
import { AlertCircleIcon, AlertTriangleIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon, RefreshCwIcon, ShieldCheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { formatDateTime, formatRelative } from '../../utils/currency';
import type { SyncEntity } from '../../types/order';
import type { TranslationKey } from '../../data/translations';

const ENTITIES: {id: SyncEntity;dir: 'in' | 'out';every: number | null;}[] = [
{ id: 'inventory', dir: 'in', every: 15 },
{ id: 'prices', dir: 'in', every: 30 },
{ id: 'products', dir: 'in', every: 360 },
{ id: 'customers', dir: 'in', every: 60 },
{ id: 'orders', dir: 'out', every: null }];


const GUARDS: TranslationKey[] = ['guard.price', 'guard.stock', 'guard.customer', 'guard.idempotency'];

export function AdminSync() {
  const { t } = useI18n();
  const { lastSync, syncLog, syncing, runSync } = useStore();

  const run = async () => {
    await runSync();
    toast.success(t('toast.syncDone'));
  };

  const warningFor = (id: SyncEntity) => syncLog.find((l) => l.entity === id && l.level !== 'ok' && l.at.slice(0, 10) === lastSync[id].slice(0, 10));

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{t('admin.sync.title')}</h1>
          <p className="mt-1 text-sm text-muted">{t('admin.sync.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={syncing}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/85 disabled:opacity-70 md:self-auto">
          
          <RefreshCwIcon className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? t('admin.sync.running') : t('admin.sync.run')}
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section aria-labelledby="ent-h">
            <h2 id="ent-h" className="sr-only">{t('admin.sync.title')}</h2>
            <ul className="divide-y divide-line rounded-2xl bg-surface ring-1 ring-line" role="list">
              {ENTITIES.map((e) => {
                const warn = warningFor(e.id);
                return (
                  <li key={e.id} className="flex items-center gap-4 px-5 py-4">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${syncing ? 'animate-pulse bg-info' : warn ? 'bg-warn' : 'bg-success'}`} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{t(`sync.${e.id}` as TranslationKey)}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                        {e.dir === 'in' ? <ArrowLeftIcon className="h-3 w-3" /> : <ArrowRightIcon className="h-3 w-3" />}
                        {t(`sync.dir.${e.dir}`)}
                        {' · '}
                        {e.every ? t('sync.every', { n: e.every }) : t('sync.realtime')}
                      </p>
                    </div>
                    <p className="text-right text-xs text-muted" title={formatDateTime(lastSync[e.id])}>
                      {t('admin.sync.last', { time: formatRelative(lastSync[e.id]) })}
                    </p>
                  </li>);

              })}
            </ul>
          </section>

          <section aria-labelledby="log-h">
            <h2 id="log-h" className="font-semibold text-ink">{t('admin.sync.log')}</h2>
            <ul className="mt-3 divide-y divide-line rounded-2xl bg-surface ring-1 ring-line" role="list">
              {syncLog.map((l) =>
              <li key={l.id} className="flex gap-3 px-5 py-3.5 text-sm">
                  {l.level === 'ok' && <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />}
                  {l.level === 'warning' && <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-warn" />}
                  {l.level === 'error' && <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-danger" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-ink">{l.message}</p>
                    <p className="mt-0.5 text-xs text-muted">{t(`sync.${l.entity}` as TranslationKey)} · {formatDateTime(l.at)}</p>
                  </div>
                </li>
              )}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-10 lg:self-start">
          <section aria-labelledby="guard-h" className="rounded-2xl bg-ink p-5 text-white">
            <h2 id="guard-h" className="flex items-center gap-2 font-semibold">
              <ShieldCheckIcon className="h-4 w-4" />
              {t('admin.sync.guards')}
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/80" role="list">
              {GUARDS.map((g) =>
              <li key={g} className="border-t border-white/10 pt-3 first:border-0 first:pt-0">{t(g)}</li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </div>);

}