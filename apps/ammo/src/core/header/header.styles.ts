import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        width: device.window.width,
        backgroundColor: theme.colors.background,
        height: (theme.element.header.height as number) + device.inset.top,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: device.inset.top,
    },
    center: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    left: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: theme.spacing.M,
    },
    right: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: theme.spacing.M,
    },
    backgroundTop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -device.inset.top,
        height: device.isIOS ? device.inset.top * 2 : device.inset.top,
    },
}));
