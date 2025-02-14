import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        flex: 1,
        padding: theme.spacing.XL,
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        width: device.window.width * 0.5,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
}));
