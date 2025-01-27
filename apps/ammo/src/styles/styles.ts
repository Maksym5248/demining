import { ThemeManager } from './theme';

export const useStylesCommon = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.background,
    },
}));
