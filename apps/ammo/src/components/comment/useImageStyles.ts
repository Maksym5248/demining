import { useMemo } from 'react';

import { useDevice, useTheme } from '~/styles';

const getListWidth = (count: number, width: number, gap: number) => {
    const w = width;
    const gap1 = gap / 2;
    const gap2 = (gap * 2) / 3;

    return [
        [w],
        [w / 2 - gap1, w / 2 - gap1],
        [w / 3 - gap2, w / 3 - gap2, w / 3 - gap2],
        [w / 2 - gap1, w / 2 - gap1, w / 2 - gap1, w / 2 - gap1],
        [w / 3 - gap2, w / 3 - gap2, w / 3 - gap2, w / 2 - gap1, w / 2 - gap1],
        [w / 3 - gap2, w / 3 - gap2, w / 3 - gap2, w / 3 - gap2, w / 3 - gap2, w / 3 - gap2],
    ][count - 1];
};

export const useImageStyles = (length: number) => {
    const theme = useTheme();
    const device = useDevice();

    const LEFT_GAP = 32 + theme.spacing.XS * 5;
    const maxImageWidth = device.window.width - LEFT_GAP;
    const count = length >= 6 ? 6 : length;
    const listWidth = getListWidth(count, maxImageWidth, theme.spacing.XXS);

    return useMemo(
        () => ({
            get: (index: number) => {
                const width = listWidth[index];

                return {
                    width,
                };
            },
        }),
        [count, device.window.width, listWidth],
    );
};
