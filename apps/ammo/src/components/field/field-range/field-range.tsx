import { View } from 'react-native';

import { Icon, Tooltip, Text } from '~/core';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './field-range.style';
import { type IFieldRangeProps } from './field-range.type';

export const FieldRange = ({ label, value, info }: IFieldRangeProps) => {
    const s = useStyles();
    const styles = useStylesCommon();
    const theme = useTheme();

    return (
        <View style={s.item}>
            <View style={s.row}>
                <Text type="label" style={styles.label} text={label} />
                {!!info && (
                    <Tooltip text={info} style={s.iconTooltip}>
                        {<Icon name="info" size={16} color={theme.colors.textSecondary} />}
                    </Tooltip>
                )}
            </View>
            <View style={[styles.row, styles.start, styles.marginHorizontalXXS]}>
                {(!value || !value?.length) && <Text text="-" />}
                {!!value?.length && <Text text={value.filter(el => !!el).join(' - ')} />}
            </View>
        </View>
    );
};
