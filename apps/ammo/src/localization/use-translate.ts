import { useContext, useCallback } from 'react';

import { TranslateOptions } from 'i18n-js';

import { Localization } from './localization';
import { LocaleContext } from './provider';

export const useTranslate = (prefix?:string) => {
  const { locale } = useContext(LocaleContext);

  const t = useCallback(
    (key: string, options?: TranslateOptions) => {
      const _key = prefix ? `${prefix}.${key}` : key;

      return Localization.t(_key, options);
    },
    [prefix, locale],
  );

  return t;
};
