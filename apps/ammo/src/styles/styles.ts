import { ThemeManager } from './theme';

export const useStylesCommon = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.background,
    },
    scrollViewContent: {
        backgroundColor: theme.colors.background,
        paddingBottom: device.inset.bottom + 20,
    },
    block: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.M,
        paddingHorizontal: theme.spacing.S,
        marginLeft: theme.spacing.S,
        marginRight: theme.spacing.S,
        marginTop: theme.spacing.S,
        paddingBottom: theme.spacing.S,
    },
    hidden: {
        overflow: 'hidden',
    },
    section: {
        marginTop: theme.spacing.S,
        marginBottom: theme.spacing.XXS,
    },
    label: {
        marginTop: theme.spacing.S,
        marginBottom: 2,
    },
    row: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.XXS,
    },
    rowStart: {
        justifyContent: 'flex-start',
    },
    marginVerticalS: {
        marginVertical: theme.spacing.S,
    },
}));
