import { ThemeManager } from './theme';

export const useStylesCommon = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.background,
    },
    fillAbsolute: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    modal: {
        height: device.window.height,
        width: device.window.width,
        padding: 0,
        margin: 0,
        backgroundColor: theme.colors.backgroundModal,
    },
    modalBottomSheet: {
        height: device.window.height,
        width: device.window.width,
        padding: 0,
        margin: 0,
    },
    scrollViewContent: {
        backgroundColor: theme.colors.background,
        paddingBottom: device.inset.bottom + 20,
    },
    flatList: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.S,
    },
    block: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.M,
        paddingHorizontal: theme.spacing.S,
        paddingBottom: theme.spacing.S,
    },
    touchable: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    contentCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    hidden: {
        overflow: 'hidden',
    },
    section: {
        marginTop: theme.spacing.S,
        marginBottom: theme.spacing.XXS,
    },
    label: {
        marginTop: theme.spacing.XXS,
        marginBottom: 2,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    start: {
        justifyContent: 'flex-start',
    },
    marginVerticalS: {
        marginVertical: theme.spacing.S,
    },
    marginTopS: {
        marginTop: theme.spacing.S,
    },
    marginHorizontalS: {
        marginHorizontal: theme.spacing.S,
    },
    marginHorizontalXXS: {
        marginHorizontal: theme.spacing.XXS,
    },
    marginBottomS: {
        marginBottom: theme.spacing.S,
    },
    gapXS: {
        gap: theme.spacing.XS,
    },
}));
