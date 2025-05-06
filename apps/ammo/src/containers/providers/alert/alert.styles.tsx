import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: theme.spacing.M,
    },
}));
