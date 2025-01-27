import { useState } from 'react';

import { type NativeSyntheticEvent, type TextInputFocusEventData } from 'react-native';

interface UseOnChangeFocusProps {
    onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    autoFocus: boolean;
    isValue: boolean;
}

export function useOnChangeFocus({ onFocus, onBlur, autoFocus, isValue }: UseOnChangeFocusProps) {
    const [isFocused, setFocused] = useState(autoFocus);

    function onFocusHandler(event: NativeSyntheticEvent<TextInputFocusEventData>) {
        onFocus && onFocus(event);
        if (!isFocused) {
            setFocused(true);
        }
    }

    function onBlurHandler(event: NativeSyntheticEvent<TextInputFocusEventData>) {
        onBlur && onBlur(event);
        if (!isValue && isFocused) {
            setFocused(false);
        }
    }

    return { onFocusHandler, onBlurHandler, isFocused };
}
