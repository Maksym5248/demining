import { StyleSheet } from 'react-native';

import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        height: undefined,
        width: undefined,
        flex: 1,
    },
    absolute: {
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '100%',
        maxHeight: '100%',
        ...StyleSheet.absoluteFillObject,
    },
}));
