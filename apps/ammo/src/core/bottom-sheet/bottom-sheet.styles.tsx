import { StyleSheet } from 'react-native';

import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(() => ({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    background: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#000000',
    },
    content: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#f2f2f7',
    },
    header: {
        height: 60,
        width: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#aeaeb2',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
    },
    backgroundButton: {
        flex: 1,
    },
    textClose: {
        color: '#0a84ff',
        fontWeight: '500',
        fontSize: 16,
        alignSelf: 'flex-start',
        flex: 0,
    },
}));
