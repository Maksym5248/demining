import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        height: device.screen.height - ((theme?.element?.header?.height as number) ?? 0) - device.inset.top - device.inset.bottom,
        paddingHorizontal: theme.spacing.M,
        paddingBottom: device.inset.bottom,
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        marginTop: theme.spacing.XXL,
        alignItems: 'center',
    },
    forgotPassword: {
        alignSelf: 'center',
        marginTop: theme.spacing.S,
        marginVertical: theme.spacing.S,
    },
    button: {
        marginTop: theme.spacing.XS,
        marginVertical: theme.spacing.S,
    },
    signUpContainer: {
        paddingHorizontal: theme.spacing.M,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: theme.spacing.S,
        alignItems: 'flex-end',
        alignContent: 'flex-end',
    },
    titleContainer: {
        marginTop: theme.spacing.XXL,
        alignItems: 'center',
    },
}));
