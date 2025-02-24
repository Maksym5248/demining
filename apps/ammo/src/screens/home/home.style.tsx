import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    header: {
        backgroundColor: theme.colors.accent,
    },
    imageContainer: {
        width: '100%',
        height: device.screen.height / 4,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 150,
        aspectRatio: 1,
    },
    searchButton: {
        marginTop: -25,
        marginHorizontal: theme.spacing.L,
    },
    content: {
        padding: theme.spacing.L,
    },
    categories: {
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row',
        paddingVertical: theme.spacing.L,
        gap: theme.spacing.L,
    },
    item: {
        width: (device.window.width - theme.spacing.L * 3) / 2,
        aspectRatio: 1,
        alignItems: 'center',
    },
}));
