import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    root: {
        flex: 1,
    },
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.accentLight,
        maxWidth: 220,
        paddingHorizontal: 8.5,
        paddingVertical: 8,
        borderRadius: 8,
    },
    corner: {
        backgroundColor: theme.colors.accentLight,
        width: 15,
        height: 15,
        marginTop: -10,
        zIndex: -1,
        transform: [{ rotate: '45deg' }],
    },
    textContainer: {
        width: '95%',
    },
    text: {
        textAlign: 'center',
    },
    close: {
        alignSelf: 'flex-start',
    },
    hidden: {
        left: -400,
    },
}));
