import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        ...theme.element.input,
        borderRadius: theme.radius.M,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
        position: 'relative',
        paddingRight: theme.spacing.S,
        paddingLeft: theme.spacing.M,
        ...theme.shadow.light,
    },
}));
