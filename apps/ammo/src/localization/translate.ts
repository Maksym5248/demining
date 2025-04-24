import { type TranslateOptions } from 'i18n-js';

import { Localization } from './localization';

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function t(key: string, options?: TranslateOptions) {
    return key
        ? Localization.t(key, {
              defaultValue: key,
              ...(options || {}),
          })
        : '';
}
