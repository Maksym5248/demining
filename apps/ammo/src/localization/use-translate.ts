import { useContext, useCallback } from 'react';

import { type TranslateOptions } from 'i18n-js';

import { Localization } from './localization';
import { LocaleContext } from './provider';

export const useTranslate = (prefix?: string) => {
    const { locale } = useContext(LocaleContext);

    const t = useCallback(
        (key?: string, options?: TranslateOptions) => {
            const _key = prefix ? `${prefix}.${key}` : key;

            return key ? Localization.t(_key as string, options) : '';
        },
        [prefix, locale],
    );

    return t;
};
