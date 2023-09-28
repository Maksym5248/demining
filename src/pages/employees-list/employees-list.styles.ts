import { css } from '@emotion/react'

const listHeader = css`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
`

const test = (theme:string) => css`
    background: ${theme};
`

export const s = {
    listHeader,
    test
}
    