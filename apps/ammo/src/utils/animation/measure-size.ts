import { type Component, type RefObject } from 'react';

import { measure, runOnJS, runOnUI } from 'react-native-reanimated';

export const measureSize = (
    aref: RefObject<Component<RefObject<Component<any>> | null>> | null,
): Promise<{ x: number; y: number; width: number; height: number; pageX: number; pageY: number }> =>
    new Promise((resolve, reject) => {
        const end = (measured: { x: number; y: number; width: number; height: number; pageX: number; pageY: number }) => {
            'worklet';
            runOnJS(resolve)(measured);
        };

        runOnUI(() => {
            'worklet';
            // @ts-ignore
            const measured = measure(aref);

            if (!measured) {
                runOnJS(reject)(new Error('measure is null'));
                return;
            }

            end(measured);
        })();
    });
