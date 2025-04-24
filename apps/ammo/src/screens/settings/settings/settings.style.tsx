import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    avatar: {
        alignSelf: 'center',
        marginVertical: theme.spacing.XL,
    },
    autenticate: {
        marginBottom: theme.spacing.XL,
    },
}));
