import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { translations, type TranslationKey } from '../data/translations';

type Vars = Record<string, string | number>;

type I18nValue = {
  locale: 'es';
  t: (key: TranslationKey, vars?: Vars) => string;
  base: Record<TranslationKey, string>;
  overrides: Partial<Record<TranslationKey, string>>;
  setOverride: (key: TranslationKey, value: string) => void;
  resetOverride: (key: TranslationKey) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: {children: React.ReactNode;}) {
  const [overrides, setOverrides] = useState<Partial<Record<TranslationKey, string>>>({});
  const base = translations.es;

  const t = useCallback(
    (key: TranslationKey, vars?: Vars) => {
      let text = overrides[key] ?? base[key] ?? key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.split(`{${name}}`).join(String(value));
        }
      }
      return text;
    },
    [overrides, base]
  );

  const setOverride = useCallback((key: TranslationKey, value: string) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetOverride = useCallback((key: TranslationKey) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ locale: 'es' as const, t, base, overrides, setOverride, resetOverride }),
    [t, base, overrides, setOverride, resetOverride]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}