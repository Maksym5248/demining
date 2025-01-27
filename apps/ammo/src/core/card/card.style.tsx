import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        padding: theme.spacing.S,
        backgroundColor: theme.colors.white,
        alignContent: 'flex-start',
        justifyContent: 'flex-end',
        borderRadius: theme.radius.M,
    },
}));
