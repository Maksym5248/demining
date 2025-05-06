import { View } from 'react-native';

import { Icon, Tooltip, Text, Paragraph } from '~/core';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './field-view.style';
import { type IFieldViewProps } from './field-view.type';

export const FieldView = ({ label, text, info, require = true }: IFieldViewProps) => {
    const s = useStyles();
    const styles = useStylesCommon();
    const theme = useTheme();

    if (!require && !text) {
        return null;
    }

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
            <Paragraph text={text ?? '-'} />
        </View>
    );
};
