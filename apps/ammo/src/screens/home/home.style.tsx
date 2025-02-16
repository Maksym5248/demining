import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    header: {
        backgroundColor: theme.colors.accent,
    },
    imageContainer: {
        width: '100%',
        height: device.window.height / 4,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        paddingBottom: theme.spacing.L,
    },
    image: {
        width: 150,
    },
    searchButton: {
        marginTop: -25,
    },
    content: {
        flex: 1,
        padding: theme.spacing.XL,
    },
    categories: {
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row',
        paddingVertical: theme.spacing.L,
        gap: theme.spacing.M,
    },
    item: {
        width: device.window.width / 2 - theme.spacing.XL - theme.spacing.M / 2,
        aspectRatio: 1,
        alignItems: 'center',
    },
}));
