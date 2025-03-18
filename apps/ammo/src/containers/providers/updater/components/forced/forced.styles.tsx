import { ThemeManager } from '~/styles';

export const getContentHeight = (device: { inset: { bottom: number } }) => device.inset.bottom + 120;

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.background,
        paddingBottom: device.inset.bottom,
    },
    content: {
        display: 'flex',
        flex: 1,
        gap: theme.spacing.XL,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.M,
        paddingVertical: theme.spacing.XL,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.M,
    },
    text: {
        textAlign: 'center',
        flex: 1,
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
