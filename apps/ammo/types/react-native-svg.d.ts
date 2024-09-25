declare module '*.svg' {
    import type React from 'react';

    import { type SvgProps } from 'react-native-svg';

    const content: React.FC<SvgProps>;
    // eslint-disable-next-line import/no-default-export
    export default content;
}
