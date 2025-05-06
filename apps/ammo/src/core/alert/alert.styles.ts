import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    content: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.S,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
    },
    subTitle: {
        color: theme.colors.primary,
        marginTop: theme.spacing.XXS,
        marginHorizontal: 4,
        textAlign: 'center',
    },
    buttonsContainer: {
        marginTop: theme.spacing.S,
        width: '100%',
        flexDirection: 'row',
    },
    cancelButton: {
        flex: 1,
    },

    cancelButtonMargin: {
        marginRight: theme.spacing.XS / 2,
    },
    submitButton: {
        flex: 1,
    },
    submitButtonMargin: {
        marginLeft: theme.spacing.XS / 2,
    },
}));
