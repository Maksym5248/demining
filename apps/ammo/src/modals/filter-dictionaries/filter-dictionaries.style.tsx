import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ device }) => ({
    container: {
        height: device.window.height * 0.8,
        width: device.window.width,
    },
}));
