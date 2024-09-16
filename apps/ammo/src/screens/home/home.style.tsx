import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        display: 'flex',
        flex: 1,
    },
    carousel: {
        flex: 1,
    },
    carouselContent: {
        justifyContent: 'flex-end',
    },
}));
