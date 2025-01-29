import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    separator: {
        height: theme.spacing.S,
    },
}));
