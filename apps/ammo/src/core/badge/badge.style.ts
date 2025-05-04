import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        position: 'relative',
    },
    badge: {
        right: -7,
        top: -7,
        position: 'absolute',
        borderRadius: 7,
        height: 14,
        width: 14,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    },
}));
