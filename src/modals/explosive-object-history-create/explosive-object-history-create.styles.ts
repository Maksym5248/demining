import { Theme } from '~/styles'

const titleContainer = Theme.css(`
    display: flex;
    flex: 1;
    justify-content: center;
    margin: 0 0 24px 0;
`)

const first = Theme.css(`
    display: inline-block;
`)

const last = Theme.css(`
    display: inline-block;
    margin: 0 0 0 8px;
`);

const spin = Theme.css(`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 300px;
`)

const item = Theme.css(`
    margin-bottom: 0px
`);

const firstNoMargin = Theme.css(`
    display: inline-block;
    margin: 0;
`);

const row = Theme.css(`
    display: flex;
    gap: 8px;
`);

export const s = {
    titleContainer,
    first,
    last,
    spin,
    item,
    firstNoMargin,
    row
}
    