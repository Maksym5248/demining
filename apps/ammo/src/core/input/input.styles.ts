import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        height: 80,
    },
    inputContainer: {
        height: 50,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.textSecondary,
    },
    input: {
        flex: 1,
        height: 50,
        width: '100%',
        color: theme.colors.primary,
        fontFamily: theme.fonts.regular,
        fontSize: theme.fontSize.P1,
        paddingTop: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        backgroundColor: 'red',
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
