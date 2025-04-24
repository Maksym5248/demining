import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme, device }) => ({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        height: device.screen.height,
        paddingHorizontal: theme.spacing.M,
    },
    inputPassword: {
        marginTop: theme.spacing.XS,
    },
    forgotPassword: {
        alignSelf: 'center',
        marginTop: theme.spacing.S,
    },
    button: {
        marginTop: theme.spacing.XS,
    },
    signUpContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: theme.spacing.S,
        alignItems: 'flex-end',
    },
}));
