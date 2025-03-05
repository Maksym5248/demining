import React, { memo, useCallback, useRef, useState } from 'react';

import { isArray } from 'lodash';

import { BottomSheet, Icon, Text, Modal, ListItem, List, type IBottomSheetRef, Button } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';
import { type IOption } from '~/types';

import { useStyles } from './select.style';
import { type ISelectModalProps } from './select.type';

export const SelectModal = memo(({ title, value, options, onSelect, hide, isMulti, ...rest }: ISelectModalProps) => {
    const styles = useStylesCommon();
    const s = useStyles();
    const theme = useTheme();
    const t = useTranslate('modals.select');
    const refBootomSheet = useRef<IBottomSheetRef>(null);
    const [selected, setSelected] = useState<unknown[]>(isArray(value) ? [...value] : [value]);

    const onSubmit = useCallback((v: IOption<unknown>[]) => {
        refBootomSheet.current?.close();
        onSelect?.(v);
    }, []);

    const onPressSubmit = useCallback(() => {
        onSubmit(options.filter(o => selected.includes(o.value)));
    }, [options, selected]);

    const onToggle = useCallback(
        (value: IOption<unknown>) => {
            if (isMulti) {
                const isSelected = selected.includes(value.value);
                setSelected(isSelected ? selected.filter(v => v !== value.value) : [...selected, value.value]);
            } else {
                onSubmit([value]);
            }
        },
        [onSelect, hide, selected, isMulti],
    );

    const renderItem = useCallback(
        ({ item }: { item: IOption<unknown> }) => {
            const isSelected = selected.includes(item.value);
            return <ListItem title={item.title} onPress={() => onToggle(item)} state={isSelected ? 'active' : 'default'} />;
        },
        [onToggle, value],
    );

    return (
        <Modal style={styles.modalBottomSheet} hide={hide} {...rest} animationInTiming={1}>
            <BottomSheet
                ref={refBootomSheet}
                header={{
                    left: <Icon name="back" color={theme.colors.accent} />,
                    center: <Text type="h5" text={title ?? t('title')} color={theme.colors.accent} />,
                }}
                onClose={hide}>
                <List
                    data={options}
                    style={s.container}
                    contentContainerStyle={isMulti ? s.containerMulti : undefined}
                    renderItem={renderItem}
                />
                {!!isMulti && <Button.Base title={t('apply')} onPress={onPressSubmit} style={s.button} />}
            </BottomSheet>
        </Modal>
    );
});

SelectModal.displayName = 'SelectModal';
