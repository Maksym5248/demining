import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        paddingTop: device.inset.top,
        backgroundColor: theme.colors.accent,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: theme.element.header.height,
        paddingHorizontal: theme.spacing.M,
    },
    icon: {
        position: 'absolute',
        right: theme.spacing.M,
        top: 0,
        bottom: 0,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
}));
