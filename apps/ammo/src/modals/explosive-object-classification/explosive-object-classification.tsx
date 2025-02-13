import React, { useCallback } from 'react';

import { observer } from 'mobx-react';

import { BottomSheet, Text, Icon, type IFlatListRenderedItem, List, Modal, TreeItem } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { type IClassificationItem } from '~/models';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './explosive-object-classification.style';
import { type IExplosiveObjectClassificationModalProps } from './explosive-object-classification.types';
import { explosiveObjectClassificationVM, type IExplosiveObjectClassificationVM } from './explosive-object-classification.vm';

const ListItem = observer(({ item, onSelect }: { item: IClassificationItem; onSelect: (id: string) => void }) => {
    const onPress = useCallback(() => onSelect?.(item.id), [item.id, onSelect]);

    return (
        <TreeItem
            onPress={onPress}
            lines={item.lines}
            title={item.displayName}
            isSection={item.isSection}
            isClass={item.isClass}
            isClassItem={item.isClassItem}
            deep={item.deep}
            state={item.isSelected ? 'active' : 'default'}
        />
    );
});

export const ExplosiveObjectClassificationModal = observer(
    ({ typeId, classItemId, onSelect, ...props }: IExplosiveObjectClassificationModalProps) => {
        const theme = useTheme();
        const styles = useStylesCommon();
        const s = useStyles();
        const t = useTranslate('modals.explosive-object-classification');

        const vm = useViewModel<IExplosiveObjectClassificationVM>(explosiveObjectClassificationVM, { typeId, classItemId });

        const _onSelect = useCallback(
            (id: string) => {
                onSelect?.(id);
                props.hide();
            },
            [vm],
        );

        const renderItem = useCallback(
            ({ item }: IFlatListRenderedItem<IClassificationItem>) => <ListItem item={item} onSelect={_onSelect} />,
            [],
        );

        return (
            <Modal style={styles.modalBottomSheet} {...props} animationInTiming={1}>
                <BottomSheet
                    header={{
                        left: <Icon name="back" color={theme.colors.accent} />,
                        center: <Text type="h5" text={t('title')} color={theme.colors.accent} />,
                    }}
                    onClose={props.hide}>
                    <List style={s.container} data={vm.asArray} renderItem={renderItem} ItemSeparatorComponent={() => undefined} />
                </BottomSheet>
            </Modal>
        );
    },
);
