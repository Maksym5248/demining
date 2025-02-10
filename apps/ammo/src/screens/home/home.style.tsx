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
        paddingBottom: theme.spacing.L,
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
        marginHorizontal: theme.spacing.XL,
        marginTop: -25,
        borderRadius: theme.radius.M,
        ...theme.shadow.light,
    },
    searchButtonContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.L,
        backgroundColor: theme.colors.white,
        borderRadius: 4,
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
    styleInfo: {
        justifyContent: 'center',
    },
}));
