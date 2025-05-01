import { View } from 'react-native';

import { Icon, Tooltip, Text, Touchable } from '~/core';
import { ThemeManager, useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './field-list.style';
import { type IFieldListProps } from './field-list.type';

export const FieldList = ({ label, items, info, type = 'vertical', splitter, splitterItem, require }: IFieldListProps) => {
    const s = useStyles();
    const styles = useStylesCommon();
    const theme = useTheme();
    const isVertical = type === 'vertical';

    const filtered = items?.filter(el => !!el.title);

    if (!require && (!items?.length || !filtered?.length)) {
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
            {(!items || !items?.length) && <Text text="-" />}
            <View style={[s.content, isVertical ? s.column : s.row]}>
                {items?.map((el, i) => (
                    <View key={i} style={styles.row}>
                        {!!el.prefix && <Text text={el.prefix} />}
                        <Touchable onPress={el.onPress} style={s.button}>
                            <Text color={el.onPress ? ThemeManager.theme.colors.link : undefined} text={el.title ?? '-'} />
                        </Touchable>
                        {splitter && !!el.text && !!el.title && <Text text={splitter} />}
                        {!!el.text && <Text text={el.text} />}
                        {!!splitterItem && items.length - 1 !== i && <Text text={splitterItem} />}
                    </View>
                )) ?? <Text text={'-'} />}
            </View>
        </View>
    );
};
