export const useTranslation = () => ({
    t: (str: string) => str,
    i18n: {
        changeLanguage: () => new Promise(() => undefined),
    },
});

export const initReactI18next = {
    type: '3rdParty',
    init: jest.fn(),
};
