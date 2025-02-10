import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    touchable: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    svg: {
        flex: 1,
    },
}));
