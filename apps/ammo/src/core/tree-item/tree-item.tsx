import React from 'react';

import { View } from 'react-native';

import { ListItem, Text } from '~/core';
import { useTheme } from '~/styles';

import { useStyles, ITEM_HEIGHT } from './tree-item.style';
import { type ITreeItemProps } from './tree-item.types';

const START_BOTTOM = 0;

export const TreeItem = ({ onPress, title, lines, isSection, isClass, isClassItem, deep, arrow, state = 'default' }: ITreeItemProps) => {
    const theme = useTheme();
    const s = useStyles();

    const offset = theme.spacing.M;
    const offsetHorizontal = offset * deep;
    const styleHorizontal = { left: offsetHorizontal - offset / 2, width: offset / 2 };

    const getStyleHorizontal = (index: number, isLast: boolean) => ({
        left: offset * index + offset / 2,
        bottom: isLast ? ITEM_HEIGHT / 2 : START_BOTTOM,
    });

    const getTitleType = () => {
        if (isSection) return 'h4';
        if (isClass) return 'h5';
        return 'h6';
    };

    const isActive = state === 'active';

    return (
        <View style={s.listItem}>
            {!!deep && (
                <>
                    <View style={[s.prefixHorizaontal, styleHorizontal]} />
                    {lines.map(({ isLast, isVisible }, index) => {
                        return isVisible ? <View key={index} style={[s.prefixVertical, getStyleHorizontal(index, isLast)]} /> : undefined;
                    })}
                </>
            )}

            <ListItem
                title={<Text type={getTitleType()} text={title} color={isActive ? theme.colors.backgroundSecondary : theme.colors.text} />}
                arrow={isClassItem && arrow}
                style={[s.listItemContent, { marginLeft: offsetHorizontal }, !isClassItem ? s.notClassItem : undefined]}
                onPress={onPress}
                state={state}
            />
        </View>
    );
};
