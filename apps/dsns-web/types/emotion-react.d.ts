// import "@emotion/react/types/css-prop"
// eslint-disable-next-line
import {} from 'react'
import { Theme } from '@emotion/react/types';
import { Interpolation } from '@emotion/serialize';

declare module 'react' {
    interface Attributes {
        css?: Interpolation<Theme>;
    }
}
