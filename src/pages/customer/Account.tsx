import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCardIcon, LockIcon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { formatDate, formatDOP } from '../../utils/currency';
import { formatTaxId } from '../../utils/taxId';
import { paymentTerms } from '../../data/priceLists';
import type { PaymentTerm, TermRequest } from '../../types/customer';

export function Account() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { currentCustomer: c, requests, createRequest, logout } = useStore();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<TermRequest['kind']>('term');
  const [term, setTerm] = useState<PaymentTerm>(45);
  const [discount, setDiscount] = useState(5);
  const [note, setNote] = useState('');
  if (!c) return null;

  const termLabel = (n: number) => n === 0 ? t('term.0') : t('term.days', { n });
  const myRequests = requests.filter((r) => r.customerId === c.id);
  const used = c.creditLimit > 0 ? Math.min(100, c.balance / c.creditLimit * 100) : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest({
      customerId: c.id,
      kind,
      requestedTerm: kind === 'term' ? term : null,
      requestedDiscountPct: kind === 'discount' ? discount : null,
      note: note.trim()
    });
    toast.success(t('request.sent'));
    setOpen(false);
    setNote('');
  };

  const conditions = [
  { label: t('cond.priceList'), value: `${c.priceList} (−${c.listDiscountPct}%)` },
  { label: t('cond.extraDiscount'), value: `${c.extraDiscountPct}%` },
  { label: t('cond.term'), value: termLabel(c.paymentTerm) },
  { label: t('cond.creditLimit'), value: formatDOP(c.creditLimit) }];


  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{t('account.title')}</h1>

      <section className="mt-6">
        <p className="text-lg font-bold text-ink">{c.name}</p>
        <p className="tabular mt-0.5 text-sm text-muted">
          {t(`taxType.${c.taxIdType}`)} {formatTaxId(c.taxIdType, c.taxId)} · {c.contactName} · {c.email}
        </p>
      </section>

      <section aria-labelledby="cond-h" className="mt-8 rounded-2xl bg-surface ring-1 ring-line">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h2 id="cond-h" className="flex items-center gap-2 font-semibold text-ink">
              <LockIcon className="h-4 w-4 text-muted" />
              {t('account.conditions')}
            </h2>
            <p className="mt-1 text-sm text-muted">{t('account.conditionsNote')}</p>
          </div>
          {!open &&
          <button type="button" onClick={() => setOpen(true)} className="h-9 shrink-0 whitespace-nowrap rounded-lg bg-canvas px-3 text-sm font-semibold text-ink hover:bg-line/60">
              {t('account.request')}
            </button>
          }
        </div>
        <dl className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {conditions.map((row) =>
          <div key={row.label} className="bg-surface p-5">
              <dt className="text-xs text-muted">{row.label}</dt>
              <dd className="tabular mt-1 font-semibold text-ink">{row.value}</dd>
            </div>
          )}
        </dl>
        {c.creditLimit > 0 &&
        <div className="border-t border-line p-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted">{t('cond.balance')}</span>
              <span className="tabular font-semibold text-ink">{formatDOP(c.balance)} / {formatDOP(c.creditLimit)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas">
              <div className={`h-full rounded-full ${used > 85 ? 'bg-warn' : 'bg-ink'}`} style={{ width: `${used}%` }} />
            </div>
          </div>
        }

        <AnimatePresence initial={false}>
          {open &&
          <motion.form
            onSubmit={submit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-line">
            
              <div className="space-y-4 p-5">
                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium text-ink">{t('request.kind')}</legend>
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
                    {(['term', 'discount'] as const).map((k) =>
                  <button
                    key={k}
                    type="button"
                    aria-pressed={kind === k}
                    onClick={() => setKind(k)}
                    className={`h-10 rounded-lg text-sm font-semibold transition-colors duration-150 ${kind === k ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>
                    
                        {t(`request.kind.${k}`)}
                      </button>
                  )}
                  </div>
                </fieldset>
                {kind === 'term' ?
              <div>
                    <label htmlFor="req-term" className="mb-1.5 block text-sm font-medium text-ink">{t('request.term')}</label>
                    <select id="req-term" value={term} onChange={(e) => setTerm(Number(e.target.value) as PaymentTerm)} className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink">
                      {paymentTerms.filter((n) => n > c.paymentTerm).map((n) =>
                  <option key={n} value={n}>{termLabel(n)}</option>
                  )}
                    </select>
                  </div> :

              <div>
                    <label htmlFor="req-disc" className="mb-1.5 block text-sm font-medium text-ink">{t('request.discount')}</label>
                    <input id="req-disc" type="number" min={1} max={20} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="tabular h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink" />
                  </div>
              }
                <div>
                  <label htmlFor="req-note" className="mb-1.5 block text-sm font-medium text-ink">{t('request.note')}</label>
                  <textarea id="req-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('request.notePlaceholder')} className="w-full rounded-xl border border-line bg-surface p-3 text-sm text-ink placeholder:text-muted/70" />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setOpen(false)} className="h-10 rounded-lg px-4 text-sm font-semibold text-muted hover:text-ink">{t('request.cancel')}</button>
                  <button type="submit" className="h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/85">{t('request.submit')}</button>
                </div>
              </div>
            </motion.form>
          }
        </AnimatePresence>
      </section>

      {myRequests.length > 0 &&
      <section aria-labelledby="req-h" className="mt-8">
          <h2 id="req-h" className="font-semibold text-ink">{t('account.requests')}</h2>
          <ul className="mt-3 divide-y divide-line rounded-2xl bg-surface ring-1 ring-line" role="list">
            {myRequests.map((r) =>
          <li key={r.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                <div>
                  <p className="font-medium text-ink">
                    {r.kind === 'term' ? `${t('request.kind.term')}: ${termLabel(r.requestedTerm ?? 0)}` : `${t('request.kind.discount')}: ${r.requestedDiscountPct}%`}
                  </p>
                  <p className="text-xs text-muted">{formatDate(r.createdAt)}</p>
                </div>
                <span className={`text-xs font-semibold ${r.status === 'approved' ? 'text-success' : r.status === 'rejected' ? 'text-danger' : 'text-warn'}`}>
                  {t(`request.status.${r.status}`)}
                </span>
              </li>
          )}
          </ul>
        </section>
      }

      <section aria-labelledby="card-h" className="mt-8">
        <h2 id="card-h" className="font-semibold text-ink">{t('account.card')}</h2>
        <div className="mt-3 flex items-center gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line">
          <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-ink text-white">
            <CreditCardIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            {c.card ?
            <>
                <p className="tabular font-semibold text-ink">{c.card.brand} •••• {c.card.last4}</p>
                <p className={`text-sm ${c.card.tokenStatus === 'expired' ? 'font-medium text-danger' : 'text-muted'}`}>
                  {c.card.tokenStatus === 'expired' ? t('account.cardExpired') : t('account.cardExpiry', { date: c.card.expiry })}
                </p>
              </> :

            <p className="text-sm text-muted">{t('account.noCard')}</p>
            }
          </div>
          <button type="button" onClick={() => toast(t('toast.cardRedirect'))} className="h-9 shrink-0 whitespace-nowrap rounded-lg bg-canvas px-3 text-sm font-semibold text-ink hover:bg-line/60">
            {t('account.updateCard')}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">{t('account.cardNote')}</p>
      </section>

      <button
        type="button"
        onClick={() => {logout();navigate('/login');}}
        className="mt-10 inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-danger hover:bg-danger-soft">
        
        <LogOutIcon className="h-4 w-4" />
        {t('account.logout')}
      </button>
    </div>);

}