import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    autenticate: {
        alignSelf: 'stretch',
        backgroundColor: theme.colors.backgroundSecondary,
        borderColor: theme.colors.accent,
        borderWidth: 1,
    },
}));
