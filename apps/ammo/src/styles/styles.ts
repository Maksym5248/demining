import { ThemeManager } from './theme';

export const useStylesCommon = ThemeManager.createStyleSheet(() => ({
    container: {
        display: 'flex',
        flex: 1,
    },
}));
