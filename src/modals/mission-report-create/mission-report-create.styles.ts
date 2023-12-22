import { Theme } from '~/styles'

const titleContainer = Theme.css(`
    display: flex;
    flex: 1;
    justify-content: center;
    margin: 0 0 24px 0;
`)

const first = Theme.css(`
    display: inline-block;
    margin: 9;
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
`)

export const s = {
    titleContainer,
    first,
    last,
    spin,
    item
}
    