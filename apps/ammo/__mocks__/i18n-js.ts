export class I18n {
    locale: string = 'en';
    translations: Record<string, any> = {};

    constructor(translations: Record<string, any>, options?: { defaultLocale?: string }) {
        this.translations = translations;
        this.locale = options?.defaultLocale || 'en';
    }

    translate(key: string, options?: Record<string, any>): string {
        const translation = this.translations[this.locale]?.[key];
        if (translation) {
            return typeof translation === 'function' ? translation(options) : translation;
        }
        return key; // Return the key if no translation is found
    }
}
