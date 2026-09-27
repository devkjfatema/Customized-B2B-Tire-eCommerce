import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, CheckCircle2Icon, Loader2Icon, ShieldCheckIcon } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useStore } from '../contexts/StoreContext';
import { BrandMark } from '../components/BrandMark';
import { digitsOnly, expectedLength, formatTaxId, isValidTaxId } from '../utils/taxId';
import type { Customer, TaxIdType } from '../types/customer';

type Mode = 'login' | 'activate';

export function Login() {
  const { t } = useI18n();
  const { login, customers } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('compras@mototuning.do');
  const [password, setPassword] = useState('demo-password');
  const [loginError, setLoginError] = useState(false);

  const [taxType, setTaxType] = useState<TaxIdType>('RNC');
  const [taxId, setTaxId] = useState('');
  const [taxError, setTaxError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState<Customer | null>(null);

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const match = customers.find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
    if (!match || password.length < 4) {
      setLoginError(true);
      return;
    }
    login(match.id);
    navigate('/catalogo');
  };

  const submitActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaxError(null);
    if (!isValidTaxId(taxType, taxId)) {
      setTaxError(t('activate.invalid', { type: t(`taxType.${taxType}`), n: expectedLength(taxType) }));
      return;
    }
    setSearching(true);
    await new Promise((r) => window.setTimeout(r, 700));
    setSearching(false);
    const match = customers.find((c) => c.taxIdType === taxType && c.taxId === digitsOnly(taxId));
    if (!match) {
      setTaxError(t('activate.notFound'));
      return;
    }
    setFound(match);
  };

  const backToLogin = () => {
    setMode('login');
    setFound(null);
    setTaxId('');
    setTaxError(null);
  };

  const inputCls =
  'h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/70 focus:border-ink focus:ring-4 focus:ring-ink/5';

  return (
    <div className="grid min-h-full w-full bg-surface lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <BrandMark inverted subtitle={t('app.tagline')} />
        <div className="max-w-md">
          <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-tight">{t('login.headline')}</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/70">{t('login.lead')}</p>
        </div>
        <img
          src="/b7e8eccd-6da0-4e6e-b619-623c79db4ae6.jpg"
          alt=""
          className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] rounded-full opacity-20 mix-blend-screen" />
        
        <p className="relative text-sm text-white/50">{t('login.separateNote')}</p>
      </aside>

      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="lg:hidden">
          <BrandMark subtitle={t('app.tagline')} />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <AnimatePresence mode="wait" initial={false}>
            {mode === 'login' ?
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
              
                <h2 className="text-2xl font-bold tracking-tight text-ink">{t('login.title')}</h2>
                <form onSubmit={submitLogin} className="mt-7 space-y-4" noValidate>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">{t('login.email')}</label>
                    <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => {setEmail(e.target.value);setLoginError(false);}} className={inputCls} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium text-ink">{t('login.password')}</label>
                      <button type="button" className="text-sm font-medium text-muted hover:text-ink">{t('login.forgot')}</button>
                    </div>
                    <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => {setPassword(e.target.value);setLoginError(false);}} className={inputCls} />
                  </div>
                  {loginError && <p role="alert" className="text-sm font-medium text-danger">{t('login.error')}</p>}
                  <button type="submit" className="h-12 w-full rounded-xl bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-brand-strong">
                    {t('login.submit')}
                  </button>
                </form>
                <div className="mt-8 border-t border-line pt-6">
                  <p className="text-sm text-muted">{t('login.firstTime')}</p>
                  <button type="button" onClick={() => setMode('activate')} className="mt-1 text-sm font-semibold text-brand hover:text-brand-strong">
                    {t('login.activateLink')}
                  </button>
                </div>
              </motion.div> :

            <motion.div
              key="activate"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
              
                <button type="button" onClick={backToLogin} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
                  <ArrowLeftIcon className="h-4 w-4" />
                  {t('activate.back')}
                </button>
                {found ?
              <div>
                    <CheckCircle2Icon className="h-10 w-10 text-success" />
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink">{t('activate.found')}</h2>
                    <div className="mt-5 rounded-xl bg-canvas p-4">
                      <p className="font-semibold text-ink">{found.name}</p>
                      <p className="tabular mt-0.5 text-sm text-muted">
                        {t(`taxType.${found.taxIdType}`)} {formatTaxId(found.taxIdType, found.taxId)}
                      </p>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-muted">{t('activate.sent', { email: maskEmail(found.email) })}</p>
                  </div> :

              <>
                    <h2 className="text-2xl font-bold tracking-tight text-ink">{t('activate.title')}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t('activate.body')}</p>
                    <form onSubmit={submitActivate} className="mt-7 space-y-4" noValidate>
                      <fieldset>
                        <legend className="mb-1.5 text-sm font-medium text-ink">{t('activate.type')}</legend>
                        <div className="grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
                          {(['RNC', 'CEDULA'] as TaxIdType[]).map((type) =>
                      <button
                        key={type}
                        type="button"
                        aria-pressed={taxType === type}
                        onClick={() => {setTaxType(type);setTaxError(null);}}
                        className={`h-10 rounded-lg text-sm font-semibold transition-colors duration-150 ${taxType === type ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>
                        
                              {t(`taxType.${type}`)}
                            </button>
                      )}
                        </div>
                      </fieldset>
                      <div>
                        <label htmlFor="taxId" className="mb-1.5 flex justify-between text-sm font-medium text-ink">
                          {t('activate.number')}
                          <span className="font-normal text-muted">{t(`activate.hint${taxType}`)}</span>
                        </label>
                        <input
                      id="taxId"
                      inputMode="numeric"
                      value={taxId}
                      placeholder={taxType === 'RNC' ? '133076782' : '00112345678'}
                      onChange={(e) => {setTaxId(digitsOnly(e.target.value).slice(0, expectedLength(taxType)));setTaxError(null);}}
                      aria-invalid={!!taxError}
                      className={`tabular ${inputCls}`} />
                    
                      </div>
                      {taxError && <p role="alert" className="text-sm font-medium text-danger">{taxError}</p>}
                      <button type="submit" disabled={searching} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-brand-strong disabled:opacity-70">
                        {searching && <Loader2Icon className="h-4 w-4 animate-spin" />}
                        {searching ? t('activate.searching') : t('activate.submit')}
                      </button>
                      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                        <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
                        {t('login.separateNote')}
                      </p>
                    </form>
                  </>
              }
              </motion.div>
            }
          </AnimatePresence>
        </div>
        <Link to="/admin" className="mx-auto text-sm font-medium text-muted hover:text-ink">{t('login.staff')}</Link>
      </main>
    </div>);

}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  return `${user.slice(0, 1)}•••@${domain}`;
}