// import "@emotion/react/types/css-prop"
// eslint-disable-next-line
import {} from 'react'
import { type Theme } from '@emotion/react/types';
import { type Interpolation } from '@emotion/serialize';

declare module 'react' {
    interface Attributes {
        css?: Interpolation<Theme>;
    }
}
