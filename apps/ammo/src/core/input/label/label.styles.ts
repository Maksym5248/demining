import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        position: 'absolute',
        height: 50,
        justifyContent: 'center',
        left: 0,
        right: 0,
        pointerEvents: 'none',
    },
    label: {
        position: 'absolute',
        left: 0,
    },
}));
