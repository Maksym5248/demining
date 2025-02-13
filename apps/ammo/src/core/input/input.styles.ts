import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        height: 80,
    },
    inputContainer: {
        ...theme.element.input,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
        paddingRight: theme.spacing.M * 2,
        paddingLeft: theme.spacing.M,
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.M,
        ...theme.shadow.light,
    },
    input: {
        ...theme.element.input,
        width: '100%',
        ...theme.text.p4,
        color: theme.colors.primary,
        paddingTop: 0,
        paddingLeft: 0,
        paddingBottom: 0,
    },
    inputText: {
        lineHeight: 50,
        alignItems: 'center',
        alignSelf: 'center',
        textAlignVertical: 'center',
    },
    hitSlop: {
        top: 15,
        right: 15,
        bottom: 15,
        left: 15,
    },
}));
