import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    separator: {
        height: theme.spacing.S,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingMore: {
        padding: theme.spacing.S,
    },
}));
