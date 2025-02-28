import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    pdf: {
        flex: 1,
    },
    pagesContainer: {
        position: 'absolute',
        bottom: theme.spacing.S,
        right: theme.spacing.S,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: theme.spacing.XS,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: theme.radius.M,
    },
    searchContainer: {
        position: 'absolute',
        width: '100%',
        backgroundColor: theme.colors.accent,
        height: (theme.element.header.height as number) + device.inset.top,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: theme.spacing.S,
        gap: theme.spacing.S,
        paddingTop: device.inset.top,
    },
    input: {
        flex: 1,
    },
}));
