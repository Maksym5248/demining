import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.XS,
    },
    button: {
        height: 25,
        paddingHorizontal: theme.spacing.S,
        borderRadius: theme.radius.L,
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
