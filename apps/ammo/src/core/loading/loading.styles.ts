import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
}));
