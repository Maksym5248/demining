import React, { useState, useEffect, createContext, useMemo } from 'react';

import { Localization, ILocalizationData } from './localization';

export const LocaleContext = createContext<ILocalizationData>({
  locale: Localization.data.locale,
});

export type ILocalizationProps = {
  children: React.ReactNode;
};

export const LocalizationProvider = ({ children }: ILocalizationProps) => {
  const [data, setData] = useState<ILocalizationData>(Localization.data);

  useEffect(() => {
    const removeListener = Localization.onChange((newData) => setData(newData));

    return () => {
      removeListener();
    };
  }, []);

  const localeData = useMemo(
    () => ({
      locale: data.locale,
    }),
    [data],
  );

  return <LocaleContext.Provider value={localeData}>{children}</LocaleContext.Provider>;
};
