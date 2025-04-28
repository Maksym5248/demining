import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    autenticate: {
        alignSelf: 'stretch',
    },
    emailVerefication: {
        textAlign: 'center',
    },
}));
