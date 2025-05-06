import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    autenticate: {
        alignSelf: 'stretch',
    },
    emailVerefication: {
        textAlign: 'center',
    },
    description: {
        marginVertical: theme.spacing.L,
        alignSelf: 'center',
    },
}));
