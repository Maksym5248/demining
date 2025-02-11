import { ThemeManager } from '~/styles';

export const getHeight = (device: { window: { height: number } }) => device.window.height * 0.8;
export const getContentHeight = (device: { window: { height: number } }) => getHeight(device) - 50;

export const useStyles = ThemeManager.createStyleSheet(({ device }) => ({
    container: {
        height: getHeight(device),
        width: device.window.width,
    },
}));
