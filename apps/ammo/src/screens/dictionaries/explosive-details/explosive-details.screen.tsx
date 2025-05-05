import React, { useCallback, useMemo } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { CommentInput, CommentView } from '~/components';
import { CommentsPreview } from '~/containers';
import { Header, CarouselImage, type IFlatListRenderedItem, List } from '~/core';
import { useAnimatedCommentInput, useViewModel } from '~/hooks';
import { useDevice, useStylesCommon } from '~/styles';

import { CharacteristicExplosive, CharacteristicPhisical, Details } from './components';
import { useStyles } from './explosive-details.style';
import { type IExplosiveDetailsScreenProps } from './explosive-details.types';
import { createVM, type IExplosiveDetailsVM } from './explosive-details.vm';
import { type IListItem } from '../explosive-device-details/explosive-device-details.types';

export const ExplosiveDetailsScreen = observer(({ route }: IExplosiveDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const s = useStyles();
    const animatedComment = useAnimatedCommentInput();

    const vm = useViewModel<IExplosiveDetailsVM>(createVM(route?.params?.id), route?.params);
    const dictionary: IListItem[] = [
        {
            id: 'carousel',
            isVisible: true,
            render: () => <CarouselImage width={device.window.width} data={vm.slides} />,
        },
        {
            id: 'details',
            isVisible: true,
            render: () => <Details item={vm.item} details={vm.details} />,
        },
        {
            id: 'characteristicExplosive',
            isVisible: true,
            render: () => <CharacteristicExplosive item={vm.item} />,
        },
        {
            id: 'characteristicPhisical',
            isVisible: true,
            render: () => <CharacteristicPhisical item={vm.item} />,
        },
        {
            id: 'comment',
            isVisible: true,
            render: () => <CommentsPreview item={vm.comments} onMeasure={animatedComment.onMeasureCommentPreview} />,
        },
    ];

    const comments: IListItem[] = useMemo(
        () =>
            vm.comments.items?.map(
                el =>
                    ({
                        id: el.id,
                        isVisible: true,
                        render: () => <CommentView item={el} />,
                    }) as IListItem,
            ) ?? ([] as IListItem[]),
        [vm.comments.items?.length],
    );

    const data = [...dictionary, ...comments].filter(item => item.isVisible);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IListItem>) => item.render(), []);

    return (
        <View style={styles.container}>
            <Header title={vm.item?.data.name} backButton="back" />
            <List
                isAnimated
                data={data}
                renderItem={renderItem}
                contentContainerStyle={[styles.scrollViewContent, s.contentContainer]}
                isLoadingMore={vm.comments.isLoadingMore}
                isEndReached={vm.comments.isEndReached}
                onEndReached={() => vm.comments.loadMore.run()}
                onScroll={animatedComment.onScroll}
            />
            <CommentInput
                item={vm.input}
                style={[styles.fillAbsoluteBottom, animatedComment.styles]}
                onLayout={animatedComment.onLayoutCommentInput}
            />
        </View>
    );
});
