import { themePrimary } from './primary-theme';
import { ThemeCreator } from './theme';
import { type IThemeSchema } from './types';

const theme: Record<string, IThemeSchema> = {
    primary: themePrimary,
};

export const Theme = new ThemeCreator<IThemeSchema>(theme);
