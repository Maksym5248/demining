import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        padding: theme.spacing.XS,
        flexDirection: 'row',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.XS,
    },
    content: {
        flex: 1,
        paddingLeft: theme.spacing.XS,
    },
    titleConainer: {
        alignItems: 'flex-start',
        display: 'flex',
        flex: 1,
        marginBottom: theme.spacing.M,
    },
    imageContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: theme.radius.M,
        gap: theme.spacing.XXS,
        overflow: 'hidden',
        marginBottom: theme.spacing.M,
    },
    image: {
        aspectRatio: 1,
    },
    imageShadow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginBottom: theme.spacing.M,
    },
    actionsContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.L,
    },
    dislike: {
        transform: [{ rotateY: '180deg' }, { rotateX: '180deg' }],
    },
    action: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.XS,
    },
    dots: {
        alignSelf: 'flex-start',
    },
}));
