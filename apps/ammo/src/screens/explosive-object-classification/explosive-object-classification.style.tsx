import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    flatList: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.L,
    },
}));
