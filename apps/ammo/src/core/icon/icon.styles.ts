import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    svg: {
        flex: 1,
    },
}));
