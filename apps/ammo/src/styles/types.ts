import { type IStyle } from 'react-native-theme-mk';

export type IPalette =
    | 'black'
    | 'grey4E'
    | 'grey92'
    | 'greyf2'
    | 'creamF5'
    | 'white'
    | 'green78'
    | 'redEF'
    | 'greyD3'
    | 'transparent'
    | 'blueF8'
    | 'blueB4'
    | 'blackTransparent01';

export type IColor =
    | 'white'
    | 'black'
    | 'primary'
    | 'secondary'
    | 'thirdiary'
    | 'border'
    | 'button'
    | 'background'
    | 'backgroundSecondary'
    | 'backgroundModal'
    | 'textSecondary'
    | 'accent'
    | 'accentLight'
    | 'error'
    | 'inert'
    | 'text'
    | 'transparent'
    | 'link'
    | 'ripplePrimary';

export interface IThemeTextStyle {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
}

export type IShadow =
    | {
          shadowColor: string;
          shadowOffset: {
              width: number;
              height: number;
          };
          shadowRadius: number;
          shadowOpacity: number;
          elevation?: undefined;
      }
    | {
          elevation: number;
          shadowColor?: undefined;
          shadowOffset?: undefined;
          shadowRadius?: undefined;
          shadowOpacity?: undefined;
      }
    | undefined;

export type ITextStyleType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'label' | 'radio';

export interface IBaseThemeSchema {
    radius: Record<'M' | 'L' | 'XL' | 'XXL', number>;
    colors: Record<IColor, string>;
    fonts: Record<'bold' | 'medium' | 'regular' | 'light', string>;
    lineHeight: Record<'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6', number>;
    spacing: Record<'XXXS' | 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL', number>;
    fontSize: Record<'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5', number>;
}
export type ITextStyle = Record<ITextStyleType, IThemeTextStyle>;
export type IElementStyle = Record<'header' | 'input' | 'radio', IStyle>;
export type IPaletteStyle = Record<IPalette, string>;
export type IShadowStyle = Record<'light' | 'none', IShadow>;

export interface IThemeSchema extends IBaseThemeSchema {
    palette: IPaletteStyle;
    element: IElementStyle;
    text: ITextStyle;
    shadow: IShadowStyle;
}
