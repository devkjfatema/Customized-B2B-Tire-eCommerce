import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { ArrowLeftIcon, CalendarClockIcon, CreditCardIcon, Loader2Icon, LockIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { OrderSummary } from '../../components/customer/OrderSummary';
import { formatDate, formatDOP } from '../../utils/currency';
import { buildLine, totals } from '../../utils/pricing';
import { formatTaxId } from '../../utils/taxId';
import type { PaymentMethod } from '../../types/order';

export function Checkout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { cart, products, currentCustomer, placeOrder } = useStore();
  const [placing, setPlacing] = useState(false);

  const customer = currentCustomer;
  const lines = customer ?
  cart.flatMap((item) => {
    const p = products.find((x) => x.id === item.productId);
    return p ? [buildLine(p, customer, item.qty)] : [];
  }) :
  [];
  const sum = totals(lines);

  const available = customer ? Math.max(0, customer.creditLimit - customer.balance) : 0;
  const cardLabel = customer?.card ? `${customer.card.brand} •••• ${customer.card.last4}` : '';
  let creditBlock: string | null = null;
  if (customer) {
    if (customer.paymentTerm === 0) creditBlock = t('pay.credit.noTerm');else
    if (!customer.card || customer.card.tokenStatus !== 'active') creditBlock = t('pay.credit.cardExpired');else
    if (sum.total > available) creditBlock = t('pay.credit.overLimit', { amount: formatDOP(available) });
  }
  const [method, setMethod] = useState<PaymentMethod>(creditBlock ? 'card' : 'credit');

  if (!customer) return null;
  if (lines.length === 0 && !placing) return <Navigate to="/carrito" replace />;

  const dueDate = format(addDays(new Date(), customer.paymentTerm), 'yyyy-MM-dd');
  const fiscal = customer.taxIdType === 'RNC' ? t('fiscal.B01') : t('fiscal.B02');

  const submit = async () => {
    setPlacing(true);
    await new Promise((r) => window.setTimeout(r, 900));
    const result = placeOrder(method);
    if (!result.ok) {
      setPlacing(false);
      toast.error(t(`error.${result.reason}`));
      return;
    }
    toast.success(t('toast.orderPlaced', { id: result.order.id }));
    navigate(`/pedidos/${result.order.id}?nuevo=1`, { replace: true });
  };

  return (
    <div>
      <Link to="/carrito" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeftIcon className="h-4 w-4" />
        {t('checkout.back')}
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">{t('checkout.title')}</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
        <div className="space-y-8">
          <section aria-labelledby="pay-h">
            <h2 id="pay-h" className="text-base font-semibold text-ink">{t('checkout.payment')}</h2>
            <div role="radiogroup" className="mt-3 space-y-3">
              <PaymentOption
                selected={method === 'credit'}
                disabled={!!creditBlock}
                onSelect={() => setMethod('credit')}
                icon={<CalendarClockIcon className="h-5 w-5" />}
                title={t('pay.credit.title', { n: customer.paymentTerm || 30 })}
                body={creditBlock ?? t('pay.credit.body', { card: cardLabel, date: formatDate(dueDate, "d 'de' MMMM") })}
                meta={!creditBlock ? t('pay.credit.available', { amount: formatDOP(available) }) : undefined}
                blocked={!!creditBlock} />
              
              <PaymentOption
                selected={method === 'card'}
                onSelect={() => setMethod('card')}
                icon={<CreditCardIcon className="h-5 w-5" />}
                title={t('pay.card.title')}
                body={customer.card?.tokenStatus === 'active' ? t('pay.card.saved', { card: cardLabel }) : t('pay.card.new')} />
              
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
              <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {t('checkout.secureNote')}
            </p>
          </section>

          <section aria-labelledby="bill-h" className="border-t border-line pt-6">
            <h2 id="bill-h" className="text-base font-semibold text-ink">{t('checkout.billing')}</h2>
            <dl className="mt-3 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">{customer.name}</dt>
                <dd className="tabular font-medium text-ink">{t(`taxType.${customer.taxIdType}`)} {formatTaxId(customer.taxIdType, customer.taxId)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{t('checkout.fiscal')}</dt>
                <dd className="font-medium text-ink">{fiscal}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted">{t('checkout.delivery')}</dt>
                <dd className="font-medium text-ink">{customer.city}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="items-h" className="border-t border-line pt-6">
            <h2 id="items-h" className="text-base font-semibold text-ink">{t('checkout.items', { n: lines.length })}</h2>
            <ul className="mt-3 divide-y divide-line text-sm" role="list">
              {lines.map((l) =>
              <li key={l.productId} className="flex items-baseline justify-between gap-4 py-2.5">
                  <span className="min-w-0 truncate text-ink">
                    <span className="tabular font-semibold">{l.qty}×</span> {l.name}
                  </span>
                  <span className="tabular shrink-0 font-medium text-ink">{formatDOP(l.lineTotal)}</span>
                </li>
              )}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary {...sum} />
          <button
            type="button"
            onClick={submit}
            disabled={placing}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-brand-strong disabled:opacity-80">
            
            {placing && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {placing ? t('checkout.placing') : t('checkout.place', { total: formatDOP(sum.total) })}
          </button>
          <p className="mt-3 text-center text-xs text-muted">{t('checkout.priceCheck')}</p>
        </aside>
      </div>
    </div>);

}

type PaymentOptionProps = {
  selected: boolean;
  disabled?: boolean;
  blocked?: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  body: string;
  meta?: string;
};

function PaymentOption({ selected, disabled, blocked, onSelect, icon, title, body, meta }: PaymentOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-2xl bg-surface p-4 text-left transition-[box-shadow,background-color] duration-150 disabled:cursor-not-allowed ${
      selected ? 'ring-2 ring-ink' : 'ring-1 ring-line hover:ring-ink/30'} ${
      disabled ? 'bg-canvas' : ''}`}>
      
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${selected ? 'bg-ink text-white' : 'bg-canvas text-muted'}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className={`block font-semibold ${disabled ? 'text-muted' : 'text-ink'}`}>{title}</span>
        <span className={`mt-0.5 block text-sm leading-relaxed ${blocked ? 'text-warn' : 'text-muted'}`}>{body}</span>
        {meta && <span className="tabular mt-1.5 block text-xs font-medium text-ink">{meta}</span>}
      </span>
      <span className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${selected ? 'border-ink bg-ink shadow-[inset_0_0_0_3px_white]' : 'border-line'}`} aria-hidden="true" />
    </button>);

}