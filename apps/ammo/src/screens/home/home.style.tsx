import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    header: {
        backgroundColor: theme.colors.accent,
    },
    imageContainer: {
        width: '100%',
        height: '25%',
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        paddingBottom: theme.spacing.M,
    },
    image: {
        height: 150,
    },
    input: {
        flex: 1,
        height: 50,
        color: theme.colors.primary,
        fontFamily: theme.fonts.regular,
        fontSize: theme.fontSize.P1,
        paddingTop: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        marginLeft: 5,
    },
    searchButton: {
        height: 50,
        marginHorizontal: theme.spacing.L,
        backgroundColor: theme.colors.white,
        transform: [{ translateY: -25 }],
        borderRadius: theme.radius.M,
        ...theme.shadow.light,
    },
    searchButtonContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.M,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        flex: 1,
        padding: theme.spacing.L,
    },
    categories: {
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row',
        paddingVertical: theme.spacing.M,
        gap: theme.spacing.S,
    },
    item: {
        width: device.window.width / 2 - theme.spacing.L - theme.spacing.S / 2,
        aspectRatio: 1,
        alignItems: 'center',
    },
}));
