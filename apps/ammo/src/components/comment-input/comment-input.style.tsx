import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        padding: theme.spacing.XS,
        paddingHorizontal: theme.spacing.M,
        flex: 1,
        flexDirection: 'row',
        borderTopColor: theme.colors.accent,
        borderTopWidth: 1,
        paddingBottom: device.inset.bottom,
        backgroundColor: theme.colors.backgroundSecondary,
    },
    badge: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        alignSelf: 'center',
        marginHorizontal: theme.spacing.M,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.M,
    },
}));
