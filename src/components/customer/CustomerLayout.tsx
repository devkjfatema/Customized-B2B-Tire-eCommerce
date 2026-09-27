import React from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { LayoutGridIcon, PackageIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { BrandMark } from '../BrandMark';
import type { TranslationKey } from '../../data/translations';

const TABS: {to: string;key: TranslationKey;icon: typeof UserIcon;}[] = [
{ to: '/catalogo', key: 'nav.catalog', icon: LayoutGridIcon },
{ to: '/carrito', key: 'nav.cart', icon: ShoppingCartIcon },
{ to: '/pedidos', key: 'nav.orders', icon: PackageIcon },
{ to: '/cuenta', key: 'nav.account', icon: UserIcon }];


export function CustomerLayout() {
  const { t } = useI18n();
  const { currentCustomer, cart } = useStore();
  if (!currentCustomer) return <Navigate to="/login" replace />;
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-full w-full bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          <Link to="/catalogo" className="min-w-0">
            <BrandMark subtitle={currentCustomer.name} />
          </Link>
          <nav aria-label={t('nav.main')} className="hidden items-center gap-1 md:flex">
            {TABS.filter((tab) => tab.to !== '/carrito').map((tab) =>
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${isActive ? 'bg-canvas text-ink' : 'text-muted hover:text-ink'}`
              }>
              
                {t(tab.key)}
              </NavLink>
            )}
          </nav>
          <Link
            to="/carrito"
            aria-label={t('header.cartAria', { n: count })}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors duration-150 hover:bg-ink/85 md:w-auto md:grid-flow-col md:gap-2 md:px-4">
            
            <ShoppingCartIcon className="h-[18px] w-[18px]" />
            <span className="hidden text-sm font-semibold md:inline">{t('nav.cart')}</span>
            {count > 0 &&
            <span className="tabular absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white md:static md:h-5">
                {count}
              </span>
            }
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:px-8 md:pb-16 md:pt-8">
        <Outlet />
      </main>

      <nav
        aria-label={t('nav.main')}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        
        <ul className="grid grid-cols-4">
          {TABS.map(({ to, key, icon: Icon }) =>
          <li key={to}>
              <NavLink
              to={to}
              className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors duration-150 ${isActive ? 'text-brand' : 'text-muted'}`
              }>
              
                <Icon className="h-5 w-5" />
                {t(key)}
                {to === '/carrito' && count > 0 &&
              <span className="tabular absolute left-1/2 top-1.5 ml-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                    {count}
                  </span>
              }
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>);

}