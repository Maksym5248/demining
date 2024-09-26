import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        flex: 1,
    },
}));
