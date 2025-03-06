import React, { useRef } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { BottomSheet, Modal, Button, Text, Icon, Separator, type IBottomSheetRef, Scroll, ListEmpty } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';
import { DictionaryType, type IOption } from '~/types';

import { ExplosiveDevice, ExplosiveObject } from './containers';
import { useStyles } from './filter-dictionaries.style';
import { type IFilterDictionariesProps } from './filter-dictionaries.type';
import { filterDictionariesVM, type IFilterDictionariesVM } from './filter-dictionaries.vm';

export const FilterDictionariesModal = observer(({ filters, onSelect, ...props }: IFilterDictionariesProps) => {
    const styles = useStylesCommon();
    const s = useStyles();
    const theme = useTheme();
    const refBootomSheet = useRef<IBottomSheetRef>(null);
    const vm = useViewModel<IFilterDictionariesVM>(filterDictionariesVM, filters);
    const tDictionaries = useTranslate('dictionaries');
    const t = useTranslate('modals.filter-dictionaries');

    const onPressSection = (option: IOption<DictionaryType>) => {
        vm.setType(option.value);
    };

    const onPressSubmit = () => {
        refBootomSheet.current?.close();
        onSelect?.(vm.filters);
    };

    const onPressClear = () => {
        vm.clear();
    };

    const options = vm.types.map(section => ({
        value: section,
        title: tDictionaries(section),
    }));

    return (
        <Modal style={styles.modalBottomSheet} {...props} animationInTiming={1}>
            <BottomSheet
                ref={refBootomSheet}
                header={{
                    left: <Icon name="back" color={theme.colors.accent} />,
                    center: <Text type="h4" text={t('title')} color={theme.colors.accent} />,
                    right: <Text text={t('reset')} color={theme.colors.accent} onPress={onPressClear} />,
                }}
                {...props}
                onClose={props.hide}>
                <Scroll style={s.container}>
                    <View style={[s.categories, styles.marginHorizontalS]}>
                        <Text type="h5" style={styles.label} color={theme.colors.accent} text={t('label-dictionaries')} />
                        <Button.Radio options={options} value={vm.type} onPress={onPressSection} />
                    </View>
                    <Separator />
                    <View style={s.content}>
                        {vm.type === DictionaryType.ExplosiveObject && <ExplosiveObject model={vm.explosiveObject} />}
                        {vm.type === DictionaryType.ExplosiveDevices && <ExplosiveDevice model={vm.explosiveDevice} />}
                        {!vm.type && <ListEmpty title={t('empty')} name="dictionary" style={s.empty} />}
                    </View>
                </Scroll>
                <Button.Base title={t('apply')} onPress={onPressSubmit} style={s.button} />
            </BottomSheet>
        </Modal>
    );
});
