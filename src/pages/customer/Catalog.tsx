import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { ProductCard } from '../../components/customer/ProductCard';
import type { ProductCategory } from '../../types/catalog';
import type { TranslationKey } from '../../data/translations';

const CATEGORIES: ('all' | ProductCategory)[] = ['all', 'scooter', 'street', 'classic', 'offroad', 'auto'];

export function Catalog() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { products, currentCustomer, cart, addToCart } = useStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | ProductCategory>('all');
  const [onlyStock, setOnlyStock] = useState(false);
  if (!currentCustomer) return null;

  const q = query.toLowerCase().replace(/\s/g, '');
  const filtered = products.filter(
    (p) =>
    (category === 'all' || p.category === category) && (
    !onlyStock || p.stock > 0) && (
    !q || `${p.code}${p.size}${p.name}`.toLowerCase().replace(/\s/g, '').includes(q))
  );

  const reset = () => {
    setQuery('');
    setCategory('all');
    setOnlyStock(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted">{t('catalog.greeting', { name: currentCustomer.contactName.split(' ')[0] })}</p>
          <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{t('catalog.title')}</h1>
        </div>
        <p className="text-sm text-muted">{t('catalog.subtitle', { list: currentCustomer.priceList })}</p>
      </div>

      <div className="sticky top-16 z-20 -mx-4 mt-5 bg-canvas/95 px-4 pb-3 pt-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('catalog.search')}
            aria-label={t('catalog.search')}
            className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-10 text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/80 focus:border-ink focus:ring-4 focus:ring-ink/5" />
          
          {query &&
          <button type="button" onClick={() => setQuery('')} aria-label={t('catalog.clear')} className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-canvas hover:text-ink">
              <XIcon className="h-4 w-4" />
            </button>
          }
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((c) =>
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`h-9 shrink-0 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-150 ${
            category === c ? 'bg-ink text-white' : 'bg-surface text-ink ring-1 ring-inset ring-line hover:bg-canvas'}`
            }>
            
              {t(`category.${c}` as TranslationKey)}
            </button>
          )}
          <span className="mx-1 h-5 w-px shrink-0 bg-line" aria-hidden="true" />
          <label className="flex h-9 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-medium text-ink">
            <input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--brand))]" />
            {t('catalog.onlyStock')}
          </label>
        </div>
      </div>

      <p className="mb-3 mt-2 text-xs font-medium text-muted" aria-live="polite">{t('catalog.count', { n: filtered.length })}</p>

      {filtered.length === 0 ?
      <div className="rounded-2xl bg-surface px-6 py-16 text-center ring-1 ring-line">
          <p className="font-semibold text-ink">{t('catalog.empty.title')}</p>
          <p className="mt-1 text-sm text-muted">{t('catalog.empty.body')}</p>
          <button type="button" onClick={reset} className="mt-5 h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/85">
            {t('catalog.empty.reset')}
          </button>
        </div> :

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {filtered.map((product) =>
        <ProductCard
          key={product.id}
          product={product}
          customer={currentCustomer}
          inCartQty={cart.find((i) => i.productId === product.id)?.qty ?? 0}
          onQuickAdd={() => {
            addToCart(product.id, 1);
            toast.success(t('toast.added', { name: product.size }), {
              action: { label: t('toast.viewCart'), onClick: () => navigate('/carrito') }
            });
          }} />

        )}
        </div>
      }
    </div>);

}