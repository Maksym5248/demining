import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    contentContainer: {
        paddingTop: 0,
        paddingHorizontal: 0,
    },
}));
