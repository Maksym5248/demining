import { ThemeManager } from '~/styles';

export const getStyleForSize = (size: number) => ({
    height: size,
    width: size,
    borderRadius: size / 2,
});

export const useStyles = ThemeManager.createStyleSheet(({ theme, utils }) => ({
    container: {
        backgroundColor: utils.hexToRgba(theme.colors.black, 0.1),
        borderWidth: 1,
        borderColor: theme.colors.accent,
        overflow: 'hidden',
    },
}));
