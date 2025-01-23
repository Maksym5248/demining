import { useCallback } from 'react';

import { View } from 'react-native';
import { observer } from 'mobx-react';

import { Carousel, Header, type IRenderItemParams } from '~/core';
import { useViewModel } from '~/hooks';
import { Text } from '~/core';
import { useDevice, useStylesCommon } from '~/styles';

import { useStyles } from './home.style';
import { homeVM, type IHomeVM } from './home.vm';
import { useTranslate } from '~/localization';

export const HomeScreen = observer(() => {
    const device = useDevice();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate("screens.home");

    const vm = useViewModel<IHomeVM>(homeVM);

    const renderFooter = useCallback(() => {
        return <View />;
    }, []);

    const renderItem = useCallback(
        ({ index }: IRenderItemParams<object>) => {
            return <View style={index % 2 ? s.green : s.red} />;
        },
        [s],
    );

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="none"/>
            <Carousel
                width={device.window.width}
                itemWidth={device.window.width}
                style={s.carousel}
                containerStyle={s.carouselContent}
                data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]}
                renderItem={renderItem}
                renderFooter={renderFooter}
            />
        </View>
    );
});
