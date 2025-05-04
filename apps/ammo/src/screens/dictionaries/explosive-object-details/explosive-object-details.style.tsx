import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    contentContainer: {
        paddingTop: 0,
        paddingHorizontal: 0,
    },
    commentInput: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
}));
