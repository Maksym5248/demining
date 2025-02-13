import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        marginVertical: theme.spacing.XS,
    },
    horizontal: {
        width: '100%',
        height: 1,
    },
}));
