// import "@emotion/react/types/css-prop"

import {} from 'react'
import { Interpolation } from '@emotion/serialize'
import { Theme } from '@emotion/react/types'

declare module 'react' {
  interface Attributes {
    css?: Interpolation<Theme>
  }
}
