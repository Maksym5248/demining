import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.M,
        position: 'relative',
        ...theme.shadow.light,
    },
    content: {
        flex: 1,
        padding: 0,
        flexDirection: 'row',
    },
    info: {
        flex: 1,
        gap: theme.spacing.XXS,
        padding: theme.spacing.XS,
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.white,
        borderBottomLeftRadius: theme.radius.M,
        borderBottomRightRadius: theme.radius.M,
    },
    svg: {
        width: 80,
        height: 80,
        marginBottom: theme.spacing.S,
        alignSelf: 'center',
    },
    image: {
        height: 70,
        aspectRatio: 1.2,
        borderTopLeftRadius: theme.radius.M,
        borderBottomLeftRadius: theme.radius.M,
    },
    tags: {
        position: 'absolute',
        width: '100%',
        aspectRatio: 2,
        padding: theme.spacing.XS,
        gap: theme.spacing.XS,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
}));
