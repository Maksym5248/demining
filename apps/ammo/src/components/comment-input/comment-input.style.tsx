import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        padding: theme.spacing.XS,
        paddingHorizontal: theme.spacing.M,
        flex: 1,
        flexDirection: 'row',
        borderTopColor: theme.colors.accent,
        borderTopWidth: 1,
        backgroundColor: theme.colors.backgroundSecondary,
        paddingBottom: device.isIOS ? device.inset.bottom : theme.spacing.XS,
        alignItems: 'flex-end',
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
        minHeight: 30,
        maxHeight: 90,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        paddingHorizontal: theme.spacing.XS,
    },
    loading: {
        maxWidth: 16,
    },
    buttons: {
        marginBottom: theme.spacing.XS,
    },
}));
