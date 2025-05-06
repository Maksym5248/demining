import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    avatar: {
        alignSelf: 'center',
        marginVertical: theme.spacing.XL,
    },
    autenticate: {
        alignSelf: 'stretch',
        backgroundColor: theme.colors.backgroundSecondary,
        borderColor: theme.colors.accent,
        borderWidth: 1,
    },
    userInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.L,
    },
    footer: {
        paddingVertical: theme.spacing.L,
        paddingHorizontal: theme.spacing.XL,
        alignItems: 'center',
        justifyContent: 'center',
    },
}));
