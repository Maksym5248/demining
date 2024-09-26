import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
}));
