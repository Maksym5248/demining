import { useRef, useCallback, type RefObject } from 'react';

import { type TextInput, type NativeSyntheticEvent, type TextInputEndEditingEventData } from 'react-native';

type IUseFocusInput = [RefObject<TextInput | null>, (e?: NativeSyntheticEvent<TextInputEndEditingEventData>) => void];

export function useFocusInput(): IUseFocusInput {
    const ref = useRef<TextInput>(null);

    const onEdited = useCallback(() => {
        ref.current?.focus();
    }, []);

    return [ref, onEdited];
}
