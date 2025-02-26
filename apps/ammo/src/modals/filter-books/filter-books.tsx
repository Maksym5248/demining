import React, { useRef } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { BottomSheet, Modal, Button, Text, Icon, Separator, type IBottomSheetRef, Scroll, Link, Chips } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';
import { type BookLoadedState, type IOption } from '~/types';

import { useStyles } from './filter-books.style';
import { type IFilterBooksProps } from './filter-books.type';
import { filterDictionariesVM, type IFilterDictionariesVM } from './filter-books.vm';

export const FilterBooksModal = observer(({ filters, onSelect, ...props }: IFilterBooksProps) => {
    const styles = useStylesCommon();
    const s = useStyles();
    const theme = useTheme();
    const refBootomSheet = useRef<IBottomSheetRef>(null);
    const vm = useViewModel<IFilterDictionariesVM>(filterDictionariesVM, filters);
    const t = useTranslate('modals.filter-books');

    const onPressLoaded = (option: IOption<BookLoadedState>) => {
        vm.setLoadedState(option.value);
    };

    const onPressTypeSelect = () => {
        vm.openTypeSelect();
    };

    const onRemoveType = () => {
        vm.removeType();
    };

    const onPressSubmit = () => {
        refBootomSheet.current?.close();
        onSelect?.(vm.filters);
    };

    const onPressClear = () => {
        vm.clear();
    };

    return (
        <Modal style={styles.modalBottomSheet} {...props} animationInTiming={1}>
            <BottomSheet
                ref={refBootomSheet}
                header={{
                    left: <Icon name="back" color={theme.colors.accent} />,
                    center: <Text type="h5" text={t('title')} color={theme.colors.accent} />,
                    right: <Text text={t('reset')} color={theme.colors.accent} onPress={onPressClear} />,
                }}
                {...props}
                onClose={props.hide}>
                <Scroll style={s.container}>
                    <View key="type" style={[styles.gapXS, styles.marginHorizontalS]}>
                        <View style={styles.row}>
                            <Text type="h6" color={theme.colors.accent} text={t('type.type')} />
                            <Link text={t('type.viewAll')} onPress={onPressTypeSelect} arrow />
                        </View>
                        <Chips options={vm.selectedType} onRemove={onRemoveType} placeholder={t('type.notSelected')} />
                    </View>
                    <Separator />
                    <View style={[s.categories, styles.marginHorizontalS]}>
                        <Text type="h6" style={styles.label} color={theme.colors.accent} text={t('loaded.label-type')} />
                        <Button.Radio
                            options={vm.loaded.map(el => ({
                                title: t(`loaded.${el.title}`),
                                value: el.value,
                            }))}
                            value={vm.filters.loadState}
                            onPress={onPressLoaded}
                        />
                    </View>
                </Scroll>
                <Button.Base title={t('apply')} onPress={onPressSubmit} style={s.button} />
            </BottomSheet>
        </Modal>
    );
});
