import { Theme } from '~/styles'

const titleContainer = Theme.css(`
    display: flex;
    flex: 1;
    justify-content: center;
    margin: 0 0 24px 0;
`)

const content = Theme.css(`
    display: flex;
    flex: 1;
    gap: 8px;
`)

export const s = {
    titleContainer,
    content
}
    