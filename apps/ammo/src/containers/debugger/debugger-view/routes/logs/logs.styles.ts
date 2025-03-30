import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    container: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 10,
        paddingTop: 20,
        backgroundColor: theme.colors.primary,
    },
    containerInside: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    log: {
        color: theme.colors.white,
    },
    logError: {
        color: theme.colors.error,
    },
    row: {
        flexDirection: 'row',
    },
}));
