import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: theme.colors.background,
    },
}));
