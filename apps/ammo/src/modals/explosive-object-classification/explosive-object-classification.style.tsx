import { ThemeManager } from '~/styles';

export const getHeight = (device: { window: { height: number } }) => device.window.height * 0.8;
export const getContentHeight = (device: { window: { height: number } }) => getHeight(device) - 50;

export const useStyles = ThemeManager.createStyleSheet(({ device }) => ({
    container: {
        width: device.window.width,
        paddingBottom: device.inset.bottom,
        flex: 0,
    },
    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: device.inset.bottom,
    },
    containerMulti: {
        paddingBottom: 100,
    },
}));
