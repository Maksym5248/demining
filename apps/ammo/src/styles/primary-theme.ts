import { Device } from '~/utils';

import { createElementsStyles } from './elements';
import { fonts } from './font-family';
import { palette } from './palette';
import { shadow } from './shadow';
import { createTextStyles } from './text';
import { type IThemeSchema, type IBaseThemeSchema } from './types';

export const themeBase: IBaseThemeSchema = {
    radius: {
        M: 4,
    },
    colors: {
        white: palette.white,
        black: palette.black,
        primary: palette.black,
        secondary: palette.grey4E,
        thirdiary: palette.grey92,
        border: palette.grey92,
        button: palette.creamF5,
        background: palette.greyf2,
        backgroundModal: palette.blackTransparent01,
        backgroundSecondary: palette.white,
        text: palette.black,
        textSecondary: palette.grey92,
        accent: palette.blueB4,
        accentLight: palette.blueF8,
        error: palette.redEF,
        transparent: palette.transparent,
        ripplePrimary: palette.blackTransparent01,
        link: palette.blueB4,
    },
    fonts: Device.isIOS
        ? {
              bold: fonts.AvenirBold,
              medium: fonts.AvenirMedium,
              regular: fonts.Avenir,
              light: fonts.AvenirLight,
          }
        : {
              bold: fonts.SansSerif,
              medium: fonts.SansSerifMedium,
              regular: fonts.SansSerif,
              light: fonts.SansSerifLight,
          },
    lineHeight: {
        H1: 36,
        H2: 32,
        H3: 28,
        H4: 26,
        H5: 24,
        H6: 20,
        P1: 26,
        P2: 24,
        P3: 18,
        P4: 18,
        P5: 16,
    },
    spacing: {
        XXXS: 2,
        XXS: 4,
        XS: 8,
        S: 12,
        M: 16,
        L: 24,
        XL: 32,
        XXL: 48,
    },
    fontSize: {
        H1: 28,
        H2: 24,
        H3: 20,
        H4: 18,
        H5: 16,
        H6: 12,
        P1: 18,
        P2: 18,
        P3: 16,
        P4: 14,
        P5: 12,
    },
};

export const themePrimary: IThemeSchema = {
    ...themeBase,
    palette,
    text: createTextStyles({ theme: themeBase }),
    element: createElementsStyles(),
    shadow,
};
