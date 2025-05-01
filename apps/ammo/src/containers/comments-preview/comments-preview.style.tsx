import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        padding: theme.spacing.S,
    },
    containerNoComments: {
        marginTop: theme.spacing.XL,
        alignSelf: 'center',
    },
}));
