import { ThemeManager } from '~/styles';

export const getContentHeight = (device: { inset: { bottom: number } }) => device.inset.bottom + 120;

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        borderTopColor: theme.colors.inert,
        borderTopWidth: 1,
        gap: theme.spacing.M,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: theme.colors.background,
        paddingBottom: device.inset.bottom + 20,
        paddingHorizontal: theme.spacing.M,
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.M,
    },
    button: {
        flex: 1,
    },
    buttonLater: {
        backgroundColor: theme.colors.inertDark,
        flex: 1,
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        gap: theme.spacing.XS,
    },
}));
