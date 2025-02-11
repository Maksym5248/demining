import { ThemeManager } from '~/styles';

export const ITEM_HEIGHT = 50;

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
    listItem: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: theme.spacing.XXS,
        height: ITEM_HEIGHT,
    },
    notClassItem: {
        backgroundColor: theme.colors.background,
        ...theme.shadow.none,
    },
    listItemContent: {
        flex: 1,
    },
    prefixHorizaontal: {
        position: 'absolute',
        left: 0,
        height: 1,
        backgroundColor: theme.colors.textSecondary,
        alignSelf: 'center',
    },
    prefixVertical: {
        position: 'absolute',
        top: -theme.spacing.XXS,
        bottom: 0,
        width: 1,
        backgroundColor: theme.colors.textSecondary,
    },
}));
