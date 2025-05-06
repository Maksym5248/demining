import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    header: {
        backgroundColor: theme.colors.accent,
    },
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.background,
        paddingBottom: device.inset.bottom + theme.spacing.S,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: device.screen.height / 2,
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
        paddingTop: theme.spacing.M,
        gap: theme.spacing.M,
    },
    scroll: {
        paddingHorizontal: theme.spacing.L,
    },
    categories: {
        gap: theme.spacing.L,
    },
    sctionTitle: {
        paddingLeft: theme.spacing.L,
    },
    sectionRight: {
        paddingRight: theme.spacing.L,
    },
    item: {
        width: device.window.width / 2.6,
        aspectRatio: 1,
        alignItems: 'center',
        marginRight: 10,
    },
}));
