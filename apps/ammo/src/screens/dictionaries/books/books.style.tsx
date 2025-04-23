import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    cardContainer: {
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        right: theme.spacing.M,
        top: theme.spacing.S,
    },
    header: {
        backgroundColor: theme.colors.accent,
    },
    filler: {
        width: '100%',
        height: 30,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
    },
    searchContainer: {
        height: 50,
        paddingHorizontal: theme.spacing.L,
        transform: [{ translateY: -25 }],
    },
    card: {
        width: device.window.width / 2 - theme.spacing.S * 1.5,
    },
    cardLeft: {
        marginRight: theme.spacing.S / 2,
    },

    cardRight: {
        marginLeft: theme.spacing.S / 2,
    },
}));
