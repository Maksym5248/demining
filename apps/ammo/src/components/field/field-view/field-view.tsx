import { View } from 'react-native';

import { Icon, Tooltip, Text } from '~/core';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './field-view.style';
import { type IFieldViewProps } from './field-view.type';

export const FieldView = ({ label, text, info }: IFieldViewProps) => {
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
            <Text text={text ?? '-'} />
        </View>
    );
};
