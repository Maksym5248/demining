import React, { useCallback, useRef } from 'react';

import { observer } from 'mobx-react';

import { BottomSheet, Text, Icon, type IFlatListRenderedItem, List, Modal, TreeItem, type IBottomSheetRef, Button } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { type IClassificationItem } from '~/models';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './explosive-object-classification.style';
import { type IExplosiveObjectClassificationModalProps } from './explosive-object-classification.types';
import { explosiveObjectClassificationVM, type IExplosiveObjectClassificationVM } from './explosive-object-classification.vm';

const ListItem = observer(
    ({ item, isMulti, onSelect }: { item: IClassificationItem; isMulti?: boolean; onSelect: (id: string) => void }) => {
        const onPress = useCallback(() => onSelect?.(item.id), [item.id, onSelect]);

        return (
            <TreeItem
                onPress={isMulti ? () => item.toggleSelected() : onPress}
                lines={item.lines}
                title={item.displayName}
                isSection={item.isSection}
                isClass={item.isClass}
                isClassItem={item.isClassItem}
                deep={item.deep}
                state={item.isSelected ? 'active' : 'default'}
            />
        );
    },
);

export const ExplosiveObjectClassificationModal = observer(
    ({ typeId, classItemId, onSelect, isMulti, ...props }: IExplosiveObjectClassificationModalProps) => {
        const theme = useTheme();
        const styles = useStylesCommon();
        const s = useStyles();
        const t = useTranslate('modals.explosive-object-classification');
        const refBootomSheet = useRef<IBottomSheetRef>(null);
        const vm = useViewModel<IExplosiveObjectClassificationVM>(explosiveObjectClassificationVM, { typeId, classItemId });

        const onSubmit = useCallback((v: string) => {
            refBootomSheet.current?.close();
            onSelect?.([v]);
        }, []);

        const onPressSubmit = useCallback(() => {
            refBootomSheet.current?.close();
            onSelect?.(vm.asArray.filter(i => i.isSelected).map(i => i.id));
        }, []);

        const renderItem = useCallback(
            ({ item }: IFlatListRenderedItem<IClassificationItem>) => <ListItem item={item} onSelect={onSubmit} isMulti={isMulti} />,
            [],
        );

        return (
            <Modal style={styles.modalBottomSheet} {...props} animationInTiming={1}>
                <BottomSheet
                    ref={refBootomSheet}
                    header={{
                        left: <Icon name="back" color={theme.colors.accent} />,
                        center: <Text type="h5" text={t('title')} color={theme.colors.accent} />,
                    }}
                    onClose={props.hide}>
                    <List
                        style={s.container}
                        data={vm.asArray}
                        renderItem={renderItem}
                        contentContainerStyle={isMulti ? s.containerMulti : undefined}
                        ItemSeparatorComponent={() => undefined}
                    />
                    {!!isMulti && <Button.Base title={t('apply')} onPress={onPressSubmit} style={s.button} />}
                </BottomSheet>
            </Modal>
        );
    },
);
