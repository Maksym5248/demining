import React from 'react';

import { View } from 'react-native';

import { BottomSheet, Text, Modal } from '~/core';
import { useStylesCommon } from '~/styles';

import { useStyles } from './filter-dictionaries.style';
import { type ILoadingProps } from './filter-dictionaries.type';

export const FilterDictionariesModal = (props: ILoadingProps) => {
    const styles = useStylesCommon();
    const s = useStyles();

    return (
        <Modal style={styles.modalBottomSheet} {...props}>
            <BottomSheet onClose={props.hide}>
                <View style={s.container}>
                    <Text>filter</Text>
                </View>
            </BottomSheet>
        </Modal>
    );
};
