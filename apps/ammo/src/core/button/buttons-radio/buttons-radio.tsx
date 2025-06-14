import { View } from 'react-native';

import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './buttons-radio.style';
import { type IButtonsRadioProps } from './buttons-radio.type';
import { Text } from '../../text';
import { Touchable } from '../../touchable';

export function ButtonsRadio<T>({ style, options, value, onPress }: IButtonsRadioProps<T>) {
    const s = useStyles();
    const theme = useTheme();
    const styles = useStylesCommon();

    return (
        <View style={[s.container, style]}>
            {options.map(option => {
                const isActive = value === option.value;

                return (
                    <View key={option.title} style={[s.button, isActive ? s.active : undefined]}>
                        <Text type="radio" color={isActive ? theme.colors.white : theme.colors.accent} text={option.title} />
                        <Touchable type="rect" style={styles.touchable} onPress={() => onPress(option)} />
                    </View>
                );
            })}
        </View>
    );
}
