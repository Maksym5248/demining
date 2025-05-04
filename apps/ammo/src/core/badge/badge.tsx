import { View } from 'react-native';

import { useTheme } from '~/styles';

import { useStyles } from './badge.style';
import { type IBadgeProps } from './badge.type';
import { Text } from '../text';

export function Badge({ count, children, style, color }: IBadgeProps) {
    const s = useStyles();
    const theme = useTheme();

    return (
        <View style={[s.container, style]}>
            {children}
            {!!count && (
                <View style={[s.badge, { backgroundColor: color || 'red' }]}>
                    <Text type="badge" color={theme.colors.white} text={count} />
                </View>
            )}
        </View>
    );
}
