import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        ...theme.element.button,
        marginHorizontal: theme.spacing.XL,
        borderRadius: theme.radius.M,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.L,
        backgroundColor: theme.colors.accent,
        position: 'relative',
        ...theme.shadow.light,
    },
    disabled: {
        backgroundColor: theme.colors.disabled,
    },
}));
