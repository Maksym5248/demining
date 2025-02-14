import { View } from 'react-native';

import { useTheme } from '~/styles';

import { useStyles } from './chips.style';
import { type IChipsProps } from './chips.type';
import { Icon } from '../icon';
import { Text } from '../text';

export function Chips<T>({ style, options, placeholder, onRemove }: IChipsProps<T>) {
    const s = useStyles();
    const theme = useTheme();

    if (!options && !!placeholder) {
        return (
            <View style={s.placeholder}>
                <Text type="radio" color={theme.colors.thirdiary} style={s.placeholderText}>
                    {placeholder}
                </Text>
            </View>
        );
    }

    if (!options) {
        return null;
    }

    const value = Array.isArray(options) ? options : [options];

    return (
        <View style={[s.container, style]}>
            {value.map(option => {
                return (
                    <View key={option.title} style={s.button}>
                        <Text type="radio" color={theme.colors.backgroundSecondary}>
                            {option.title}
                        </Text>
                        <Icon
                            name="close"
                            color={theme.colors.backgroundSecondary}
                            size={12}
                            onPress={onRemove ? () => onRemove(option) : undefined}
                        />
                    </View>
                );
            })}
        </View>
    );
}
