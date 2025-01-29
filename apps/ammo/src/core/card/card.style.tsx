import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.M,
        overflow: 'hidden',
        position: 'relative',
        ...theme.shadow.light,
    },
    content: {
        flex: 1,
        padding: 0,
    },
    info: {
        flex: 1,
        gap: theme.spacing.XXS,
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
    tags: {
        position: 'absolute',
        width: '100%',
        aspectRatio: 2,
        padding: theme.spacing.XS,
        gap: theme.spacing.XXS,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
}));
