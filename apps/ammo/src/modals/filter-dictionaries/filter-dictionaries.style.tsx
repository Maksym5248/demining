import { ThemeManager } from '~/styles';

export const getHeight = (device: { window: { height: number } }) => device.window.height * 0.8;
export const getContentHeight = (device: { window: { height: number } }) => getHeight(device) - 50;

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        height: getHeight(device),
        width: device.window.width,
    },
    content: {
        flex: 1,
        marginTop: theme.spacing.M,
    },
    categories: {
        paddingHorizontal: theme.spacing.S,
        gap: theme.spacing.XS,
    },
    empty: {
        justifyContent: 'flex-start',
        marginTop: device.window.height * 0.1,
    },
}));
