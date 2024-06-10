import { createContext, useContext } from 'react';

import { fetchLocaleLang } from '@/lib/i18n';

const locale = fetchLocaleLang();
type LocalOrNull = typeof locale | null;
const LocaleContext = createContext<LocalOrNull>(null);

type Props = {
  children: React.ReactNode;
};

export const LocaleProvider: React.FC<Props> = ({ children }) => {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocalOrNull => useContext(LocaleContext);
