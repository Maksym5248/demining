import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        ...theme.element.input,
        marginHorizontal: theme.spacing.XL,
        borderRadius: theme.radius.M,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.L,
        backgroundColor: theme.colors.backgroundSecondary,
        position: 'relative',
        ...theme.shadow.light,
    },
}));
