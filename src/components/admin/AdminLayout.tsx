import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ExternalLinkIcon, LanguagesIcon, ReceiptTextIcon, RefreshCwIcon, UsersIcon } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useStore } from '../../contexts/StoreContext';
import { BrandMark } from '../BrandMark';
import type { TranslationKey } from '../../data/translations';

const NAV: {to: string;key: TranslationKey;icon: typeof UsersIcon;end?: boolean;}[] = [
{ to: '/admin', key: 'admin.nav.customers', icon: UsersIcon, end: true },
{ to: '/admin/pedidos', key: 'admin.nav.orders', icon: ReceiptTextIcon },
{ to: '/admin/sincronizacion', key: 'admin.nav.sync', icon: RefreshCwIcon },
{ to: '/admin/textos', key: 'admin.nav.texts', icon: LanguagesIcon }];


export function AdminLayout() {
  const { t } = useI18n();
  const { requests } = useStore();
  const pending = requests.filter((r) => r.status === 'pending').length;

  const link = (isActive: boolean) =>
  `flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
  isActive ? 'bg-canvas text-ink' : 'text-muted hover:bg-canvas/60 hover:text-ink'}`;


  return (
    <div className="min-h-full w-full bg-canvas lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:py-6">
          <BrandMark subtitle={t('admin.title')} />
          <Link to="/catalogo" className="text-xs font-semibold text-muted hover:text-ink lg:hidden">{t('admin.viewApp')}</Link>
        </div>
        <nav aria-label={t('admin.title')} className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
          {NAV.map(({ to, key, icon: Icon, end }) =>
          <NavLink key={to} to={to} end={end} className={({ isActive }) => link(isActive)}>
              <Icon className="h-4 w-4" />
              {t(key)}
              {to === '/admin' && pending > 0 &&
            <span className="tabular ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-white">{pending}</span>
            }
            </NavLink>
          )}
        </nav>
        <div className="mt-auto hidden border-t border-line p-4 lg:block">
          <Link to="/catalogo" className="flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
            <ExternalLinkIcon className="h-4 w-4" />
            {t('admin.viewApp')}
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-bold text-white">DO</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">{t('admin.user')}</p>
              <p className="text-xs text-muted">{t('admin.role')}</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 md:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>);

}