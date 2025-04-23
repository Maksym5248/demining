import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Header, Paragraph, Scroll, Text } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useStylesCommon } from '~/styles';

import { aboutVM, type IAboutVM } from './about.vm';

export const AboutScreen = observer(() => {
    const styles = useStylesCommon();
    const t = useTranslate('screens.about');

    const vm = useViewModel<IAboutVM>(aboutVM);

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" />
            <Scroll contentContainerStyle={[styles.scrollViewContent, styles.marginVerticalS]}>
                {vm.asArray.map((item, index) => (
                    <View key={index} style={[styles.marginBottomS, styles.marginHorizontalS]}>
                        <Text type="h5" text={`${index + 1}) ${t(item.title)}`} style={styles.marginBottomS} />
                        <Paragraph text={item.text ? t(item.text) : item.email} />
                    </View>
                ))}
            </Scroll>
        </View>
    );
});
