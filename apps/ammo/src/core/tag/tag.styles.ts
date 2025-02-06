import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        borderRadius: theme.radius.M,
        overflow: 'hidden',
        paddingVertical: 2,
        paddingHorizontal: 6,
    },
}));
