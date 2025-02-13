import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { BottomSheet, Modal, Button, Text, Icon, ListEmpty } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';
import { DictionaryType, type IOption } from '~/types';

import { ExplosiveObject } from './containers';
import { useStyles } from './filter-dictionaries.style';
import { type IFilterDictionariesProps } from './filter-dictionaries.type';
import { filterDictionariesVM, type IFilterDictionariesVM } from './filter-dictionaries.vm';

export const FilterDictionariesModal = observer((props: IFilterDictionariesProps) => {
    const styles = useStylesCommon();
    const s = useStyles();
    const theme = useTheme();
    const vm = useViewModel<IFilterDictionariesVM>(filterDictionariesVM);
    const tDictionaries = useTranslate('dictionaries');
    const t = useTranslate('modals.filter-dictionaries');

    const onPressSection = (option: IOption<DictionaryType>) => {
        vm.setSection(option.value);
    };

    const options = vm.sections.map(section => ({
        value: section,
        title: tDictionaries(section),
    }));

    return (
        <Modal style={styles.modalBottomSheet} {...props} animationInTiming={1}>
            <BottomSheet
                header={{
                    left: <Icon name="back" color={theme.colors.accent} />,
                    center: <Text type="h5" text={t('title')} color={theme.colors.accent} />,
                    right: <Text text={t('reset')} color={theme.colors.accent} />,
                }}
                onClose={props.hide}>
                <ScrollView style={s.container}>
                    <View style={s.categories}>
                        <Text type="h6" style={styles.label} color={theme.colors.accent}>
                            {t('label-dictionaries')}
                        </Text>
                        <Button.Radio options={options} value={vm.section} onPress={onPressSection} />
                    </View>
                    <View style={s.content}>
                        {vm.section === DictionaryType.ExplosiveObject && <ExplosiveObject model={vm.explosiveObject} />}
                        {!vm.section && <ListEmpty title={t('empty')} name="dictionary" style={s.empty} />}
                    </View>
                </ScrollView>
            </BottomSheet>
        </Modal>
    );
});
