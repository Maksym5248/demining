import { type Mask } from '~/types';

type RegEX = (str?: string) => string | undefined;

const getDefaultTranslation = (): Record<Mask, RegEX> => ({
    '9': (str?: string) => str?.replace(/[^0-9]+/g, ''),
    A: (str?: string) => str?.replace(/[^a-zA-Z]+/g, ''),
    S: (str?: string) => str?.replace(/[^a-zA-Z0-9]+/g, ''),
    '*': (str?: string) => str,
});

export const toMaskPattern = (value: string, mask: Mask, translation: Record<Mask, RegEX> = getDefaultTranslation()) => {
    let result = '';
    let maskCharIndex = 0;
    let valueCharIndex = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // if mask is ended, break.
        if (maskCharIndex === mask.length) {
            break;
        }
        // if value is ended, break.
        if (valueCharIndex === value.length) {
            break;
        }
        const maskChar = mask[maskCharIndex];
        const valueChar = value[valueCharIndex];
        // value equals mask, just set
        if (maskChar === valueChar) {
            result += maskChar;
            valueCharIndex += 1;
            maskCharIndex += 1;
            continue;
        }
        // apply translator if match
        const translationHandler = translation[maskChar as Mask];
        if (translationHandler) {
            const resolverValue = translationHandler(valueChar || '');
            if (resolverValue === '') {
                // valueChar replaced so don't add it to result, keep the mask at the same point and continue to next value char
                valueCharIndex += 1;
                continue;
            } else if (resolverValue !== null) {
                result += resolverValue;
                valueCharIndex += 1;
            } else {
                result += maskChar;
            }
            maskCharIndex += 1;
            continue;
        }
        // not masked value, fixed char on mask
        result += maskChar;
        maskCharIndex += 1;
        continue;
    }
    return result;
};
