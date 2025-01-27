import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        padding: theme.spacing.S,
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.M,
    },
    content: {
        display: 'flex',
        alignContent: 'flex-start',
        justifyContent: 'flex-end',
    },
    svg: {
        width: 80,
        height: 80,
        marginBottom: theme.spacing.XS,
        alignSelf: 'center',
    },
    titleSvg: {
        alignSelf: 'center',
    },
}));
