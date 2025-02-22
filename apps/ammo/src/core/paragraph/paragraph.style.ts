import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    text: {
        flex: 1,
        padding: 0,
        margin: 0,
        flexWrap: 'wrap',
        textAlign: 'auto',
    },
    line: {
        flexWrap: 'wrap',
        textAlign: 'auto',
    },
    firstLineMargin: {
        marginLeft: 10,
    },
}));
