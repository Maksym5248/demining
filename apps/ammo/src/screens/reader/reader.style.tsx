import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    pdf: {
        flex: 1,
    },
    pagesContainer: {
        position: 'absolute',
        bottom: theme.spacing.S,
        right: theme.spacing.S,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: theme.spacing.XS,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: theme.radius.M,
    },
}));
