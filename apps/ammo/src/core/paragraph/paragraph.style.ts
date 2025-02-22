import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    text: {
        flex: 1,
        padding: 0,
        margin: 0,
        flexWrap: 'wrap',
        textAlign: 'auto',
        width: '100%',
    },
    line: {
        flexWrap: 'wrap',
        textAlign: 'auto',
        width: '100%',
    },
    firstLineMargin: {
        marginLeft: 10,
    },
}));
