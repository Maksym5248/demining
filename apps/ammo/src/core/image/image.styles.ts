import { StyleSheet } from 'react-native';

import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        overflow: 'hidden',
    },
    image: {
        height: undefined,
        width: undefined,
        flex: 1,
    },
    absolute: {
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFillObject,
    },
}));
