import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { type IComment } from 'shared-my-client';

import { CommentView, Section } from '~/components';
import { Header, type IFlatListRenderedItem, List, Paragraph, CarouselImage, Block } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { CommentModel } from '~/models';
import { useDevice, useStylesCommon } from '~/styles';

import { Details } from './components';
import { useStyles } from './explosive-object-details.style';
import { type IListItem, type IExplosiveObjectDetailsScreenProps } from './explosive-object-details.types';
import { createVM, type IExplosiveObjectDetailsVM } from './explosive-object-details.vm';

const mockId = 'SgmgAFIy3xkBUagzM5ZU';
const mockComment = new CommentModel({
    author: {
        photoUri:
            'https://firebasestorage.googleapis.com/v0/b/dsns-dev-85963.appspot.com/o/IMAGE%2Fd422e851-1869-4020-b3e7-4a55ffa6425e?alt=media&token=5d3e6073-aa54-4d27-b49c-b688b7a15389',
        displayName: 'John Doe',
    },
    data: {
        imageUris: [
            'https://firebasestorage.googleapis.com/v0/b/dsns-dev-85963.appspot.com/o/IMAGE%2Fd422e851-1869-4020-b3e7-4a55ffa6425e?alt=media&token=5d3e6073-aa54-4d27-b49c-b688b7a15389',
            'https://firebasestorage.googleapis.com/v0/b/dsns-dev-85963.appspot.com/o/IMAGE%2Fd422e851-1869-4020-b3e7-4a55ffa6425e?alt=media&token=5d3e6073-aa54-4d27-b49c-b688b7a15389',
            'https://firebasestorage.googleapis.com/v0/b/dsns-dev-85963.appspot.com/o/IMAGE%2Fd422e851-1869-4020-b3e7-4a55ffa6425e?alt=media&token=5d3e6073-aa54-4d27-b49c-b688b7a15389',
            'https://firebasestorage.googleapis.com/v0/b/dsns-dev-85963.appspot.com/o/IMAGE%2Fd422e851-1869-4020-b3e7-4a55ffa6425e?alt=media&token=5d3e6073-aa54-4d27-b49c-b688b7a15389',
            'https://firebasestorage.googleapis.com/v0/b/dsns-dev-85963.appspot.com/o/IMAGE%2Fd422e851-1869-4020-b3e7-4a55ffa6425e?alt=media&token=5d3e6073-aa54-4d27-b49c-b688b7a15389',
            'https://firebasestorage.googleapis.com/v0/b/dsns-dev-85963.appspot.com/o/IMAGE%2Fd422e851-1869-4020-b3e7-4a55ffa6425e?alt=media&token=5d3e6073-aa54-4d27-b49c-b688b7a15389',
            'https://firebasestorage.googleapis.com/v0/b/dsns-dev-85963.appspot.com/o/IMAGE%2Fd422e851-1869-4020-b3e7-4a55ffa6425e?alt=media&token=5d3e6073-aa54-4d27-b49c-b688b7a15389',
            'https://firebasestorage.googleapis.com/v0/b/dsns-dev-85963.appspot.com/o/IMAGE%2Fd422e851-1869-4020-b3e7-4a55ffa6425e?alt=media&token=5d3e6073-aa54-4d27-b49c-b688b7a15389',
        ],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
} as unknown as IComment);

export const ExplosiveObjectDetailsScreen = observer(({ route }: IExplosiveObjectDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const s = useStyles();
    const t = useTranslate('screens.explosive-object-details');

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params ?? { id: mockId });

    const { details } = vm.item ?? {};

    const items: IListItem[] = [
        {
            id: 'carousel',
            isVisible: true,
            render: () => <CarouselImage width={device.window.width} data={vm.slides} />,
        },
        {
            id: 'details',
            isVisible: true,
            render: () => <Details item={vm.item} />,
        },
        {
            id: 'fullDescription',
            isVisible: !!details?.data?.fullDescription,
            render: () => (
                <Block title={t('fullDescription')}>
                    <Paragraph text={details?.data?.fullDescription ?? '-'} />
                </Block>
            ),
        },
        {
            id: 'historical',
            isVisible: vm.historical.isVisible,
            render: () => <Section.Carousel title={t('historical')} item={vm.historical} />,
        },
        {
            id: 'purpose',
            isVisible: vm.purpose.isVisible,
            render: () => <Section.Carousel title={t('purpose')} item={vm.purpose} />,
        },
        {
            id: 'structure',
            isVisible: vm.structure.isVisible,
            render: () => <Section.Carousel title={t('structure')} item={vm.structure} />,
        },
        {
            id: 'folding',
            isVisible: vm.folding.isVisible,
            render: () => <Section.Carousel title={t('folding')} item={vm.folding} />,
        },
        {
            id: 'action',
            isVisible: vm.action.isVisible,
            render: () => <Section.Carousel title={t('action')} item={vm.action} />,
        },
        {
            id: 'extraction',
            isVisible: vm.extraction.isVisible,
            render: () => <Section.Carousel title={t('extraction')} item={vm.extraction} />,
        },
        {
            id: 'liquidator',
            isVisible: vm.liquidator.isVisible,
            render: () => <Section.Carousel title={t('liquidator')} item={vm.liquidator} />,
        },
        {
            id: 'installation',
            isVisible: vm.installation.isVisible,
            render: () => <Section.Carousel title={t('installation')} item={vm.installation} />,
        },
        {
            id: 'neutralization',
            isVisible: vm.neutralization.isVisible,
            render: () => <Section.Carousel title={t('neutralization')} item={vm.neutralization} />,
        },
        {
            id: 'marking',
            isVisible: vm.marking.isVisible,
            render: () => <Section.Carousel title={t('marking')} item={vm.marking} />,
        },
        {
            id: 'comment',
            isVisible: true,
            render: () => <CommentView item={mockComment} />,
        },
    ].filter(item => item.isVisible);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IListItem>) => item.render(), []);

    return (
        <View style={styles.container}>
            <Header title={vm.item?.data.name} backButton="back" />
            <List data={items} renderItem={renderItem} contentContainerStyle={[styles.scrollViewContent, s.contentContainer]} />
        </View>
    );
});
