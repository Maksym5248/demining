import { Theme } from '~/styles'

const titleContainer = Theme.css(`
    display: flex;
    flex: 1;
    justify-content: center;
    margin: 0 0 24px 0;
`)

const number = Theme.css(`
    display: inline-block;
    margin: 9;
`)

const subNumber = Theme.css(`
    display: inline-block;
    margin: 0 0 0 8px;
`)

export const s = {
    titleContainer,
    number,
    subNumber
}
    