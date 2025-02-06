import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    pagination: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
    },
    image: {
        width: '100%',
        aspectRatio: 1.2,
    },
}));
