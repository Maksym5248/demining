import React, { useCallback, useRef } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { BottomSheet, Modal, Button, Carousel, type IRenderItemParams, type ICarouselRef } from '~/core';
import { type IOption } from '~/core/button/buttons-radio/buttons-radio.type';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useDevice, useStylesCommon } from '~/styles';
import { DictionaryType } from '~/types';

import { ExplosiveObject } from './containers';
import { getContentHeight, useStyles } from './filter-dictionaries.style';
import { type IFilterDictionariesProps } from './filter-dictionaries.type';
import { filterDictionariesVM, type IFilterDictionariesVM } from './filter-dictionaries.vm';

export const FilterDictionariesModal = observer((props: IFilterDictionariesProps) => {
    const styles = useStylesCommon();
    const device = useDevice();
    const s = useStyles();
    const vm = useViewModel<IFilterDictionariesVM>(filterDictionariesVM);
    const tDictionaries = useTranslate('dictionaries');
    const carouselRef = useRef<ICarouselRef>(null);

    const contentHeight = getContentHeight(device);

    const renderItem = useCallback(({ item, itemWidth }: IRenderItemParams<{ section: DictionaryType }>) => {
        if (item.section === DictionaryType.ExplosiveObject) {
            return (
                <View style={{ height: contentHeight, width: itemWidth }}>
                    <ExplosiveObject />
                </View>
            );
        }
    }, []);

    const onChangedIndex = useCallback((index: number) => {
        vm.setSection(vm.sections[index]);
    }, []);

    const onPressSection = useCallback((option: IOption<DictionaryType>) => {
        vm.setSection(option.value);
        const index = vm.sections.findIndex(el => el === option.value);
        carouselRef.current?.animatedToIdex(index);
    }, []);

    const options = vm.sections.map(section => ({
        value: section,
        title: tDictionaries(section),
    }));

    return (
        <Modal style={styles.modalBottomSheet} {...props} animationInTiming={1}>
            <BottomSheet onClose={props.hide}>
                <View style={s.container}>
                    <Button.Radio options={options} value={vm.section} onPress={onPressSection} />
                    <Carousel.Container
                        ref={carouselRef}
                        initialIndex={vm.sections.findIndex(el => el === vm.section)}
                        width={device.window.width}
                        itemWidth={device.window.width}
                        data={vm.sections.map(section => ({ section }))}
                        renderItem={renderItem}
                        style={styles.hidden}
                        onChangedIndex={onChangedIndex}
                        delayChangeIndexCallBack={0}
                        lazy
                    />
                </View>
            </BottomSheet>
        </Modal>
    );
});
