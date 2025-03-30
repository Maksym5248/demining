import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: device.inset.top,
        bottom: 0,
    },
    tabBar: {
        backgroundColor: theme.colors.primary,
    },
    tabBarIndicator: {
        backgroundColor: theme.colors.accent,
    },
    tabStyle: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    labelStyle: {
        marginHorizontal: 0,
    },
    content: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    header: {
        height: 30,
        width: device.window.width,
        flexDirection: 'row',
        paddingHorizontal: 24,
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
    },
    closeButton: {
        width: 24,
    },
}));
