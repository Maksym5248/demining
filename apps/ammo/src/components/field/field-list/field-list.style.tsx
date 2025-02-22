import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    item: {
        alignItems: 'flex-start',
    },
    content: {
        gap: theme.spacing.XS,
    },
    row: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
    },
    iconTooltip: {
        marginLeft: theme.spacing.XS,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
}));
