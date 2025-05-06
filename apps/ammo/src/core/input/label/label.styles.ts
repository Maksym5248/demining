import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        position: 'absolute',
        height: 50,
        justifyContent: 'center',
        left: 0,
        right: 0,
        pointerEvents: 'none',
        ...theme.shadow.light,
    },
    label: {
        position: 'absolute',
        left: 0,
        color: theme.colors.inertDark,
        size: theme.fontSize.P5,
    },
}));
