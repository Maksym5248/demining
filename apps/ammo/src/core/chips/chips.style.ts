import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.XS,
    },
    button: {
        ...theme.element.radio,
        paddingHorizontal: theme.spacing.S,
        borderRadius: theme.radius.L,
        borderColor: theme.colors.accent,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.XXS,
        backgroundColor: theme.colors.accent,
    },
    placeholder: {
        ...theme.element.radio,
        paddingHorizontal: theme.spacing.S,
        alighItems: 'center',
    },
    placeholderText: {
        textAlign: 'center',
    },
}));
