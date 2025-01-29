import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    header: {
        backgroundColor: theme.colors.accent,
    },
    filler: {
        width: '100%',
        height: '5%',
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        paddingBottom: theme.spacing.M,
    },
    searchContainer: {
        height: 50,
        paddingHorizontal: theme.spacing.L,
        transform: [{ translateY: -25 }],
    },
    flatList: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.L,
    },
}));
