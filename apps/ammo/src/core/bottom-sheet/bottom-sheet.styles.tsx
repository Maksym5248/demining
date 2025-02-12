import { ThemeManager } from '~/styles';

export const useStyles = ThemeManager.createStyleSheet(({ theme }) => ({
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
        position: 'relative',
        height: 60,
        width: '100%',
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // borderBottomColor: '#aeaeb2',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',
    },
    headerCenter: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundButton: {
        flex: 1,
    },
    textClose: {
        color: theme.colors.accent,
        fontWeight: '500',
        fontSize: 16,
        alignSelf: 'flex-start',
        flex: 0,
    },
}));
