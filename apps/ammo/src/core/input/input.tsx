import React, { forwardRef, type ForwardedRef, useCallback, useRef, useState } from 'react';

import { isString } from 'lodash';
import { View, UIManager, LayoutAnimation, TextInput as RNTextInput, Text as RNText } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useOnChange } from 'shared-my-client';

import { ThemeManager, useTheme } from '~/styles';
import { layoutConfig, toMaskPattern } from '~/utils';

import { useStyles } from './input.styles';
import { type IInputProps } from './input.types';
import { Label } from './label';
import { useOnChangeFocus } from './use-on-change-focus';
import { Icon } from '../icon';
import { Text } from '../text';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const getBorderStyle = (theme: { colors: { border: string; error: string; accent: string } }, isValid: boolean, isFocused: boolean) => {
    let color = theme.colors.border;

    if (!isValid) {
        color = theme.colors.error;
    } else if (isFocused) {
        color = theme.colors.accent;
    }

    return { borderBottomColor: color };
};

const Component = (
    {
        onChangeValue,
        label,
        style,
        contentStyle,
        inputStyle,
        labelStyle,
        isValid,
        message,
        testID,
        onFocus,
        onBlur,
        autoFocus = false,
        value = '',
        secureTextEntry,
        secureTextEntryIcon = true,
        right,
        left,
        mask,
        pointerEvents,
        disabled = false,
        isClearable,
        ...rest
    }: IInputProps,
    ref: ForwardedRef<RNTextInput>,
) => {
    const innerRef = useRef<RNTextInput>(null);
    const outerRef = typeof ref === 'function' ? { current: null } : ref;
    const inputRef = outerRef || innerRef;

    const s = useStyles();
    const theme = useTheme();
    const [secureEntry, setSecureEntry] = useState(secureTextEntry);
    const paddingLeftLabel = useSharedValue(0);

    const _onChangeValue = useCallback(
        (text: string) => {
            if (mask) {
                const formatted = toMaskPattern(text, mask);
                inputRef.current && inputRef.current.setNativeProps({ text: formatted });

                onChangeValue?.(formatted);
            } else {
                onChangeValue?.(text);
            }
        },
        [onChangeValue, inputRef, mask],
    );

    useOnChange(() => {
        LayoutAnimation.configureNext(layoutConfig.keyboard);
    }, [isValid]);

    const { onFocusHandler, onBlurHandler, isFocused } = useOnChangeFocus({
        onFocus,
        onBlur,
        autoFocus,
        isValue: !!value,
    });

    const renderLeftIcon = () => left;

    const renderRightIcon = () => {
        if (secureTextEntry && secureTextEntryIcon) {
            const iconProps = {
                onPress: () => setSecureEntry(!secureEntry),
                hitSlop: s.hitSlop,
                size: 24,
            };

            return secureEntry ? <Icon {...iconProps} name="eye" /> : <Icon {...iconProps} name="eye-hidden" />;
        }

        if (isClearable && !!value) {
            const iconProps = {
                onPress: () => onChangeValue?.(''),
                hitSlop: s.hitSlop,
                size: 24,
            };

            return <Icon {...iconProps} name="close" color={ThemeManager.theme.colors.textSecondary} />;
        }

        return right;
    };

    const onLayoutLeftIcon = ({ nativeEvent }: { nativeEvent: { layout: { width: number } } }) => {
        const newValue = nativeEvent.layout.width + 20;

        if (paddingLeftLabel.value !== newValue) {
            paddingLeftLabel.value = newValue;
        }
    };

    return (
        <View style={[s.container, style]} pointerEvents={pointerEvents}>
            <View style={[s.inputContainer, getBorderStyle(theme, !!isValid, isFocused), contentStyle]}>
                <View onLayout={onLayoutLeftIcon}>{renderLeftIcon()}</View>
                {!!disabled && <RNText style={[s.input, s.inputText, inputStyle]}>{value}</RNText>}
                {!disabled && (
                    <RNTextInput
                        blurOnSubmit={false}
                        returnKeyType="next"
                        autoCapitalize="none"
                        placeholder=""
                        {...rest}
                        value={value}
                        secureTextEntry={secureEntry}
                        autoCorrect={false}
                        underlineColorAndroid={theme.colors.transparent}
                        testID={`input.${testID}`}
                        selectionColor={theme.colors.accent}
                        placeholderTextColor={theme.colors.thirdiary}
                        onBlur={onBlurHandler}
                        onFocus={onFocusHandler}
                        style={[s.input, inputStyle]}
                        ref={inputRef}
                        onChangeText={_onChangeValue}
                    />
                )}
                {renderRightIcon()}
            </View>
            {!!label && <Label text={label} isSmall={isFocused || !!value} style={labelStyle} paddingLeft={paddingLeftLabel} />}
            {!!message && isString(message) && (
                <Text
                    testID={`input.${testID}.message`}
                    type="p3"
                    color={isValid ? theme.colors.thirdiary : theme.colors.error}
                    text={message}
                />
            )}
            {!!message && !isString(message) && message}
        </View>
    );
};

export const TextInput = forwardRef(Component) as (props: IInputProps & React.RefAttributes<RNTextInput>) => ReturnType<typeof Component>;
