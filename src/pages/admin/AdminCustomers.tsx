import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRightIcon, SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { formatDate, formatDOP } from '../../utils/currency';
import { digitsOnly, formatTaxId } from '../../utils/taxId';

export function AdminCustomers() {
  const { t } = useI18n();
  const { customers, requests, resolveRequest } = useStore();
  const [query, setQuery] = useState('');

  const termLabel = (n: number) => n === 0 ? t('term.0') : t('term.days', { n });
  const pending = requests.filter((r) => r.status === 'pending');
  const q = query.trim().toLowerCase();
  const qDigits = digitsOnly(query);
  const filtered = customers.filter((c) => !q || c.name.toLowerCase().includes(q) || qDigits && c.taxId.includes(qDigits));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{t('admin.customers.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('admin.customers.subtitle')}</p>

      <AnimatePresence initial={false}>
        {pending.length > 0 &&
        <motion.section
          aria-labelledby="req-h"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6 overflow-hidden rounded-2xl bg-surface ring-1 ring-brand/30">
          
            <h2 id="req-h" className="border-b border-line bg-brand-soft px-5 py-3 text-sm font-semibold text-brand-strong">
              {t('admin.requests.title', { n: pending.length })}
            </h2>
            <ul className="divide-y divide-line" role="list">
              <AnimatePresence initial={false}>
                {pending.map((r) => {
                const c = customers.find((x) => x.id === r.customerId);
                if (!c) return null;
                return (
                  <motion.li
                    key={r.id}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
                    
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">
                          <Link to={`/admin/clientes/${c.id}`} className="hover:underline">{c.name}</Link>
                        </p>
                        <p className="mt-0.5 text-sm text-ink">
                          {r.kind === 'term' ?
                        t('admin.requests.term', { n: r.requestedTerm ?? 0, current: termLabel(c.paymentTerm) }) :
                        t('admin.requests.discount', { n: r.requestedDiscountPct ?? 0, current: c.extraDiscountPct })}
                        </p>
                        <p className="mt-0.5 text-sm text-muted">“{r.note}” · {formatDate(r.createdAt)}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                        type="button"
                        onClick={() => {resolveRequest(r.id, false);toast(t('toast.rejected'));}}
                        className="h-9 rounded-lg px-3 text-sm font-semibold text-muted ring-1 ring-line hover:bg-canvas hover:text-ink">
                        
                          {t('admin.reject')}
                        </button>
                        <button
                        type="button"
                        onClick={() => {resolveRequest(r.id, true);toast.success(t('toast.approved'));}}
                        className="h-9 rounded-lg bg-ink px-3 text-sm font-semibold text-white hover:bg-ink/85">
                        
                          {t('admin.approve')}
                        </button>
                      </div>
                    </motion.li>);

              })}
              </AnimatePresence>
            </ul>
          </motion.section>
        }
      </AnimatePresence>

      <div className="relative mt-8 max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('admin.search')}
          aria-label={t('admin.search')}
          className="h-10 w-full rounded-lg border border-line bg-surface pl-10 pr-3 text-sm text-ink outline-none focus:border-ink" />
        
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-surface ring-1 ring-line">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-line text-xs font-medium text-muted">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">{t('col.customer')}</th>
              <th scope="col" className="px-3 py-3 font-medium">{t('col.priceList')}</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">{t('col.extra')}</th>
              <th scope="col" className="px-3 py-3 font-medium">{t('col.term')}</th>
              <th scope="col" className="px-3 py-3 font-medium">{t('col.credit')}</th>
              <th scope="col" className="px-3 py-3 font-medium">{t('col.card')}</th>
              <th scope="col" className="w-10"><span className="sr-only">{t('admin.open')}</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((c) => {
              const used = c.creditLimit > 0 ? Math.min(100, c.balance / c.creditLimit * 100) : 0;
              return (
                <tr key={c.id} className="group transition-colors duration-150 hover:bg-canvas">
                  <td className="px-5 py-3.5">
                    <Link to={`/admin/clientes/${c.id}`} className="font-semibold text-ink after:absolute">{c.name}</Link>
                    <p className="tabular text-xs text-muted">{t(`taxType.${c.taxIdType}`)} {formatTaxId(c.taxIdType, c.taxId)}</p>
                  </td>
                  <td className="px-3 py-3.5 text-ink">{c.priceList} <span className="text-muted">−{c.listDiscountPct}%</span></td>
                  <td className="tabular px-3 py-3.5 text-right font-medium text-ink">{c.extraDiscountPct > 0 ? `${c.extraDiscountPct}%` : '—'}</td>
                  <td className="px-3 py-3.5 text-ink">
                    {termLabel(c.paymentTerm)}
                    {c.termApprovedBy && <span className="ml-1.5 rounded bg-warn-soft px-1.5 py-0.5 text-[11px] font-semibold text-warn">{t('admin.form.exceptional')}</span>}
                  </td>
                  <td className="px-3 py-3.5">
                    {c.creditLimit > 0 ?
                    <div className="w-40">
                        <div className="h-1.5 overflow-hidden rounded-full bg-canvas ring-1 ring-inset ring-line">
                          <div className={`h-full ${used > 85 ? 'bg-warn' : 'bg-ink'}`} style={{ width: `${used}%` }} />
                        </div>
                        <p className="tabular mt-1 text-xs text-muted">{formatDOP(c.balance)} / {formatDOP(c.creditLimit)}</p>
                      </div> :

                    <span className="text-muted">—</span>
                    }
                  </td>
                  <td className="px-3 py-3.5">
                    {c.card ?
                    <span className={`text-xs font-semibold ${c.card.tokenStatus === 'active' ? 'text-success' : 'text-danger'}`}>
                        {c.card.brand} •••• {c.card.last4} · {t(`card.${c.card.tokenStatus}`)}
                      </span> :

                    <span className="text-xs text-muted">{t('card.none')}</span>
                    }
                  </td>
                  <td className="pr-4">
                    <Link to={`/admin/clientes/${c.id}`} aria-label={`${t('admin.open')} ${c.name}`} className="grid h-8 w-8 place-items-center rounded-lg text-muted group-hover:text-ink">
                      <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-5 py-10 text-center text-sm text-muted">{t('admin.customers.empty')}</p>}
      </div>
    </div>);

}