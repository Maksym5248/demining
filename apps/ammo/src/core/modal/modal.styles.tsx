import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        flex: 1,
        padding: 0,
        margin: 0,
    },
}));
