import { themePrimary } from './primary-theme';
import { ThemeCreator } from './theme';
import { useThemeName } from './theme/use-theme-name';
import { type IThemeSchema } from './types';

const theme: Record<string, IThemeSchema> = {
    primary: themePrimary,
};

export const Theme = new ThemeCreator<IThemeSchema>(theme);

export const useTheme = () => {
    const theme = useThemeName();
    return Theme.get(theme);
};
