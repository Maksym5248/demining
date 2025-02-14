import { ThemeManager } from '~/styles';

export const getHeight = (device: { window: { height: number } }) => device.window.height * 0.8;
export const getContentHeight = (device: { window: { height: number } }) => getHeight(device) - 50;

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        height: getHeight(device),
        width: device.window.width,
        paddingBottom: device.inset.bottom + Number(theme.element.button.height),
    },
    content: {
        flex: 1,
    },
    categories: {
        gap: theme.spacing.XS,
    },
    empty: {
        justifyContent: 'flex-start',
        marginTop: device.window.height * 0.1,
    },
    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: device.inset.bottom,
    },
}));
