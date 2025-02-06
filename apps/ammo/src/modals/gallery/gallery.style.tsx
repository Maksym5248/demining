import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ device }) => ({
    container: {
        flex: 1,
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolbar: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
        height: device.inset.top + 60,
        paddingTop: device.inset.top,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    close: {
        position: 'absolute',
        left: 20,
        top: device.inset.top + 15,
    },
}));
