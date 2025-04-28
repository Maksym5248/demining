import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        ...theme.element.button,
        borderRadius: theme.radius.M,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.L,
        backgroundColor: theme.colors.accent,
        position: 'relative',
        ...theme.shadow.light,
    },
    invert: {
        backgroundColor: theme.colors.inert,
    },
    disabled: {
        backgroundColor: theme.colors.disabled,
    },
    accent: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderColor: theme.colors.accent,
        borderWidth: 1,
    },
}));
