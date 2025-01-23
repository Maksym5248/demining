import React, { FunctionComponent } from 'react';

import _ from 'lodash';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Navigation } from '~/services';
import { ThemeManager } from '~/styles';
import { toUpper } from '~/utils';

import { Text } from '../text';
import { useStyles } from './header.styles';
import { IHeaderProps } from './header.types';
import { Icon } from '../icon';

export const Header: FunctionComponent<IHeaderProps> = ({
  title,
  titleStyle,
  isTitleAnimated,
  left,
  center,
  right,
  style,
  centerStyle,
  isAnimated,
  color = ThemeManager.theme.colors.primary,
  pointerEvents = 'auto',
  onPressBack,
  backButton = 'back',
  children,
}) => {
  const s = useStyles();

  const renderLeft = () => {
    let component = left;

    if (!component && backButton === 'back') {
      component = (
        <Icon
          name="back"
          size={24}
          color={color}
          onPress={onPressBack || (() => Navigation.goBack())}
        />
      );
    } else if (!component && backButton === 'close') {
      component = (
        <Icon
          name="close"
          size={24}
          color={color}
          onPress={onPressBack || (() => Navigation.goBack())}
        />
      );
    }

    return <View style={s.left}>{component}</View>;
  };

  const renderCenter = () => {
    let component = center;

    if (title) {
      component = (
        <Text
          isAnimated={isTitleAnimated}
          numberOfLines={1}
          type="h5"
          style={[color ? { color } : {}, ...(_.isArray(titleStyle) ? titleStyle : [titleStyle])]}
          text={toUpper(title)}
        />
      );
    }

    return <View style={[s.center, centerStyle]}>{component}</View>;
  };

  const renderRight = () => <View style={s.right}>{right}</View>;

  const Container = isAnimated ? Animated.View : View;

  return (
    <Container
      style={[s.container, ...(_.isArray(style) ? style : [style])]}
      pointerEvents={pointerEvents}>
      {!children && renderLeft()}
      {!children && renderCenter()}
      {!children && renderRight()}
      {children}
    </Container>
  );
};
