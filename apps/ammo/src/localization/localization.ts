import EventEmitter from 'events';

import { I18n, type TranslateOptions } from 'i18n-js';
import { cloneDeep } from 'lodash';
import { findBestLanguageTag } from 'react-native-localize';

import { Analytics } from '~/services';

const translations = {
    uk: require('./translations/uk.json'),
    en: require('./translations/en.json'),
};

enum LOCALIZATION_EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}

export interface ILocalizationData {
    locale: 'uk' | 'en';
}

const fallback = {
    isRTL: false,
    languageTag: 'uk',
};

// @ts-ignore
const eventEmitter = new EventEmitter();

const findBestAvailableLanguage = (languageTags: string[]) => {
    return findBestLanguageTag(languageTags) || fallback;
};

interface ILocalization {
    data: Readonly<ILocalizationData>;
    init: (initialData?: ILocalizationData) => Promise<void>;
    updateLocale: (locale: string) => void;
    t: (key: string, options?: TranslateOptions) => string;
    onChange: (callBack: (value: ILocalizationData, shouldSave: boolean) => void) => () => void;
    removeAllListeners: () => void;
}

class LocalizationClass implements ILocalization {
    i18n = new I18n(translations, {
        defaultLocale: fallback.languageTag,
    });

    setLocale = (languageTag: string) => {
        this.i18n.locale = languageTag;
    };

    sendEvent(shouldSave: boolean = false) {
        eventEmitter.emit(LOCALIZATION_EVENTS.ON_CHANGE, cloneDeep(this.data), shouldSave);
    }

    get data(): Readonly<ILocalizationData> {
        return {
            locale: this.i18n.locale as 'uk' | 'en',
        };
    }

    updateLocale = (locale: string) => {
        this.setLocale(locale);
        this.sendEvent(true);
    };

    /**
     * translate
     */
    t(key: string, options?: TranslateOptions): string {
        return this.i18n.translate(key, options) ?? '';
    }

    onChange = (callBack: (value: ILocalizationData, shouldSave: boolean) => void) => {
        eventEmitter.on(LOCALIZATION_EVENTS.ON_CHANGE, callBack);

        return () => eventEmitter.removeListener(LOCALIZATION_EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }

    init = async (initialData?: ILocalizationData) => {
        try {
            if (initialData?.locale) {
                this.setLocale(initialData?.locale);
            } else {
                const bestAvailableLanguage = findBestAvailableLanguage(Object.keys(translations));
                Analytics.setLanguage(bestAvailableLanguage.languageTag);
                this.setLocale(bestAvailableLanguage.languageTag);
            }
        } catch (e) {
            /* empty */
        } finally {
            this.sendEvent();
        }
    };
}

export const Localization = new LocalizationClass();
