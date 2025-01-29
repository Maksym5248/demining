import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.M,
        overflow: 'hidden',
        ...theme.shadow.light,
    },
    content: {
        flex: 1,
        padding: 0,
    },
    info: {
        flex: 1,
        padding: theme.spacing.S,
        alignContent: 'flex-start',
        justifyContent: 'flex-end',
    },
    svg: {
        width: 80,
        height: 80,
        marginBottom: theme.spacing.XS,
        alignSelf: 'center',
    },
    image: {
        width: '100%',
        aspectRatio: 2,
    },
}));
