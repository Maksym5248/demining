import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        borderRadius: theme.radius.M,
        position: 'relative',
        padding: 0,
        flexDirection: 'row',
        backgroundColor: theme.colors.backgroundSecondary,
        ...theme.shadow.light,
    },
    containerActive: {
        backgroundColor: theme.colors.accent,
    },
    info: {
        flex: 1,
        gap: theme.spacing.XXS,
        padding: theme.spacing.XS,
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: theme.radius.M,
    },
    svg: {
        width: 80,
        height: 80,
        marginTop: theme.spacing.XS,
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
    arrow: {
        transform: [{ rotate: '180deg' }],
        marginRight: theme.spacing.XS,
    },
    titleActive: {
        backgroundColor: theme.colors.backgroundSecondary,
    },
}));
