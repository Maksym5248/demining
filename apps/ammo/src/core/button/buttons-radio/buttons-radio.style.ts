import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        position: 'relative',
        flexDirection: 'row',
        padding: theme.spacing.XS,
        gap: theme.spacing.XS,
    },
    button: {
        height: 40,
        paddingHorizontal: theme.spacing.S,
        borderRadius: theme.radius.M,
        backgroundColor: theme.colors.backgroundSecondary,
        borderColor: theme.colors.accent,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundColor: theme.colors.accent,
    },
    text: {
        color: theme.colors.accent,
    },
    activeText: {
        color: theme.colors.backgroundSecondary,
    },
}));
