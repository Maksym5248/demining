import { View } from 'react-native';

import { useTheme } from '~/styles';

import { useStyles } from './badge.style';
import { type IBadgeProps } from './badge.type';
import { Text } from '../text';

export function Badge({ count, children, style }: IBadgeProps) {
    const s = useStyles();
    const theme = useTheme();

    return (
        <View style={[s.container, style]}>
            {children}
            {!!count && (
                <View style={s.badge}>
                    <Text type="badge" color={theme.colors.backgroundSecondary}>
                        {count}
                    </Text>
                </View>
            )}
        </View>
    );
}
