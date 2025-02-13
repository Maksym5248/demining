import React, { memo, useCallback } from 'react';

import { BottomSheet, Icon, Text, Modal, ListItem, List } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';
import { type IOption } from '~/types';

import { useStyles } from './select.style';
import { type ISelectModalProps } from './select.type';

export const SelectModal = memo(({ title, value, options, onSelect, hide, ...rest }: ISelectModalProps) => {
    const styles = useStylesCommon();
    const s = useStyles();
    const theme = useTheme();
    const t = useTranslate('modals.select');

    const _onSelect = useCallback(
        (value: IOption<unknown>) => {
            onSelect?.(value);
            hide();
        },
        [onSelect, hide],
    );

    const renderItem = useCallback(
        ({ item }: { item: IOption<unknown> }) => {
            const isSelected = item.value === value;
            return <ListItem title={item.title} onPress={() => _onSelect(item)} state={isSelected ? 'active' : 'default'} />;
        },
        [_onSelect, value],
    );

    return (
        <Modal style={styles.modalBottomSheet} hide={hide} {...rest} animationInTiming={1}>
            <BottomSheet
                header={{
                    left: <Icon name="back" color={theme.colors.accent} />,
                    center: <Text type="h5" text={title ?? t('title')} color={theme.colors.accent} />,
                }}
                onClose={hide}>
                <List data={options} style={s.container} renderItem={renderItem} />
            </BottomSheet>
        </Modal>
    );
});

SelectModal.displayName = 'SelectModal';
