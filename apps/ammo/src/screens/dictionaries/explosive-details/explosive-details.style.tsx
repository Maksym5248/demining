import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    item: {
        alignItems: 'flex-start',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconTooltip: {
        marginLeft: theme.spacing.XS,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        paddingTop: 0,
        paddingHorizontal: 0,
    },
}));
