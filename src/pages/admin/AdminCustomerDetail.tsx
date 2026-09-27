import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangleIcon, ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { EXCEPTIONAL_DISCOUNT, EXCEPTIONAL_TERM, paymentTerms, priceLists } from '../../data/priceLists';
import { formatDOP } from '../../utils/currency';
import { formatTaxId } from '../../utils/taxId';
import { unitPriceAt } from '../../utils/pricing';
import type { Customer, PaymentTerm } from '../../types/customer';

type FormState = Pick<Customer, 'priceList' | 'listDiscountPct' | 'extraDiscountPct' | 'paymentTerm' | 'creditLimit'>;

export function AdminCustomerDetail() {
  const { t } = useI18n();
  const { id } = useParams();
  const { customers, products, orders, updateCustomer } = useStore();
  const customer = customers.find((c) => c.id === id);

  const toForm = (c: Customer): FormState => ({
    priceList: c.priceList,
    listDiscountPct: c.listDiscountPct,
    extraDiscountPct: c.extraDiscountPct,
    paymentTerm: c.paymentTerm,
    creditLimit: c.creditLimit
  });
  const [form, setForm] = useState<FormState | null>(customer ? toForm(customer) : null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (customer) setForm(toForm(customer));
    setConfirmed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id]);

  if (!customer || !form) {
    return (
      <div className="py-20 text-center">
        <p className="font-semibold text-ink">{t('admin.customer.notFound')}</p>
        <Link to="/admin" className="mt-3 inline-block text-sm font-semibold text-brand">{t('admin.back')}</Link>
      </div>);

  }

  const termLabel = (n: number) => n === 0 ? t('term.0') : t('term.days', { n });
  const dirty = (Object.keys(form) as (keyof FormState)[]).some((k) => form[k] !== customer[k]);
  const needsApproval =
  form.paymentTerm >= EXCEPTIONAL_TERM && form.paymentTerm !== customer.paymentTerm ||
  form.extraDiscountPct > EXCEPTIONAL_DISCOUNT && form.extraDiscountPct !== customer.extraDiscountPct;
  const canSave = dirty && (!needsApproval || confirmed) && form.extraDiscountPct >= 0 && form.extraDiscountPct <= 30 && form.creditLimit >= 0;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    updateCustomer(customer.id, {
      ...form,
      termApprovedBy: form.paymentTerm >= EXCEPTIONAL_TERM ? needsApproval ? t('admin.user') : customer.termApprovedBy : null
    });
    setConfirmed(false);
    toast.success(t('admin.form.saved', { name: customer.name }));
  };

  const preview = products[0];
  const previewCustomer: Customer = { ...customer, ...form };
  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const available = Math.max(0, form.creditLimit - customer.balance);

  const inputCls = 'tabular h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-ink';

  return (
    <div>
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeftIcon className="h-4 w-4" />
        {t('admin.back')}
      </Link>
      <div className="mt-3">
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{customer.name}</h1>
        <p className="tabular mt-1 text-sm text-muted">
          {t(`taxType.${customer.taxIdType}`)} {formatTaxId(customer.taxIdType, customer.taxId)} · {t('admin.odoo', { id: customer.odooId })} · {customer.contactName} · {customer.city}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <form onSubmit={save} className="rounded-2xl bg-surface ring-1 ring-line">
          <div className="border-b border-line p-5">
            <h2 className="font-semibold text-ink">{t('admin.form.title')}</h2>
            <p className="mt-1 text-sm text-muted">{t('admin.form.subtitle')}</p>
          </div>
          <div className="grid gap-6 p-5 md:grid-cols-2">
            <div>
              <label htmlFor="pl" className="mb-1.5 block text-sm font-medium text-ink">{t('admin.form.priceList')}</label>
              <select
                id="pl"
                value={form.priceList}
                onChange={(e) => {
                  const pl = priceLists.find((p) => p.name === e.target.value)!;
                  setForm({ ...form, priceList: pl.name, listDiscountPct: pl.discountPct });
                }}
                className={inputCls}>
                
                {priceLists.map((pl) =>
                <option key={pl.name} value={pl.name}>{pl.name} (−{pl.discountPct}%)</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="extra" className="mb-1.5 block text-sm font-medium text-ink">{t('admin.form.extra')}</label>
              <input
                id="extra"
                type="number"
                min={0}
                max={30}
                step={0.5}
                value={form.extraDiscountPct}
                onChange={(e) => setForm({ ...form, extraDiscountPct: Number(e.target.value) })}
                className={inputCls} />
              
              <p className="mt-1.5 text-xs text-muted">{t('admin.form.extraHelp')}</p>
            </div>
            <fieldset className="md:col-span-2">
              <legend className="mb-1.5 text-sm font-medium text-ink">{t('admin.form.term')}</legend>
              <div className="grid grid-cols-5 gap-1 rounded-xl bg-canvas p-1">
                {paymentTerms.map((n) =>
                <button
                  key={n}
                  type="button"
                  aria-pressed={form.paymentTerm === n}
                  onClick={() => setForm({ ...form, paymentTerm: n as PaymentTerm })}
                  className={`h-10 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors duration-150 ${
                  form.paymentTerm === n ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'}`
                  }>
                  
                    {termLabel(n)}
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-muted">
                {t('admin.form.termHelp', { n: EXCEPTIONAL_TERM })}
                {customer.termApprovedBy && ` · ${t('admin.form.approvedBy', { name: customer.termApprovedBy })}`}
              </p>
            </fieldset>
            <div>
              <label htmlFor="limit" className="mb-1.5 block text-sm font-medium text-ink">{t('admin.form.credit')}</label>
              <input
                id="limit"
                type="number"
                min={0}
                step={5000}
                value={form.creditLimit}
                onChange={(e) => setForm({ ...form, creditLimit: Number(e.target.value) })}
                className={inputCls} />
              
              <p className="tabular mt-1.5 text-xs text-muted">{t('admin.account.available')}: {formatDOP(available)}</p>
            </div>
          </div>

          {needsApproval &&
          <div className="mx-5 mb-5 rounded-xl bg-warn-soft p-4 text-sm text-warn">
              <p className="flex items-start gap-2 font-medium">
                <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                {t('admin.form.exceptionalNote', { term: EXCEPTIONAL_TERM, pct: EXCEPTIONAL_DISCOUNT })}
              </p>
              <label className="mt-3 flex cursor-pointer items-start gap-2 text-ink">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[rgb(var(--ink))]" />
                {t('admin.form.exceptionalConfirm')}
              </label>
            </div>
          }

          <div className="flex items-center justify-end gap-2 border-t border-line p-4">
            <button
              type="button"
              disabled={!dirty}
              onClick={() => {setForm(toForm(customer));setConfirmed(false);}}
              className="h-10 rounded-lg px-4 text-sm font-semibold text-muted hover:text-ink disabled:opacity-40">
              
              {t('admin.form.discard')}
            </button>
            <button type="submit" disabled={!canSave} className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-strong disabled:bg-line disabled:text-muted">
              {t('admin.form.save')}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <section aria-labelledby="prev-h">
            <h2 id="prev-h" className="text-sm font-semibold text-ink">{t('admin.preview.title')}</h2>
            <p className="mt-0.5 text-xs text-muted">{t('admin.preview.body', { product: preview.name })}</p>
            <ul className="tabular mt-3 divide-y divide-line rounded-xl bg-surface text-sm ring-1 ring-line" role="list">
              {preview.tiers.map((tier, i) => {
                const next = preview.tiers[i + 1];
                return (
                  <li key={tier.minQty} className="flex justify-between px-4 py-2.5">
                    <span className="text-muted">
                      {next ? t('tiers.range', { min: tier.minQty, max: next.minQty - 1 }) : t('tiers.rangeOpen', { min: tier.minQty })}
                    </span>
                    <span className="font-semibold text-ink">{formatDOP(unitPriceAt(preview, previewCustomer, tier))}</span>
                  </li>);

              })}
            </ul>
          </section>

          <section aria-labelledby="acct-h" className="rounded-xl bg-surface p-4 text-sm ring-1 ring-line">
            <h2 id="acct-h" className="font-semibold text-ink">{t('admin.account.title')}</h2>
            <dl className="tabular mt-3 space-y-2">
              <div className="flex justify-between"><dt className="text-muted">{t('admin.account.balance')}</dt><dd className="font-medium text-ink">{formatDOP(customer.balance)}</dd></div>
              <div className="flex justify-between">
                <dt className="text-muted">{t('col.card')}</dt>
                <dd className={`font-medium ${customer.card?.tokenStatus === 'expired' ? 'text-danger' : 'text-ink'}`}>
                  {customer.card ? `${customer.card.brand} •••• ${customer.card.last4} · ${t(`card.${customer.card.tokenStatus}`)}` : t('card.none')}
                </dd>
              </div>
              <div className="flex justify-between"><dt className="text-muted">{t('admin.nav.orders')}</dt><dd className="font-medium text-ink">{customerOrders.length}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </div>);

}