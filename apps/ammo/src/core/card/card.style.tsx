import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        position: 'relative',
        borderRadius: theme.radius.M,
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 0,
        ...theme.shadow.light,
    },
    touchable: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        borderRadius: theme.radius.M,
    },
    info: {
        flex: 1,
        position: 'relative',
        gap: theme.spacing.XXS,
        padding: theme.spacing.XS,
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
    },
    svg: {
        width: 80,
        height: 80,
        padding: theme.spacing.XS,
        marginBottom: theme.spacing.S,
        alignSelf: 'center',
    },
    imageBox: {
        width: '100%',
        aspectRatio: 1.2,
        borderTopLeftRadius: theme.radius.M,
        borderTopRightRadius: theme.radius.M,
    },
    image: {
        width: '100%',
        aspectRatio: 2,
        borderTopLeftRadius: theme.radius.M,
        borderTopRightRadius: theme.radius.M,
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
