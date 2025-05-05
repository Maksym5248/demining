import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        minHeight: device.screen.height - ((theme?.element?.header?.height as number) ?? 0) - device.inset.top - device.inset.bottom,
        paddingHorizontal: theme.spacing.M,
        paddingBottom: device.inset.bottom,
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
    },
    content: {
        paddingTop: theme.spacing.S,
        flex: 1,
    },
    title: {
        marginTop: theme.spacing.XXL,
        alignItems: 'center',
    },
    button: {
        marginTop: theme.spacing.XS,
        marginVertical: theme.spacing.S,
    },
    containerTextInput: {
        height: 210,
    },
    textInput: {
        height: 180,
        verticalAlign: 'top',
    },
}));
