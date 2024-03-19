import { Theme } from '~/styles'

const container = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: stretch;
    padding-right: 8px;
`)

const search = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
`)

const title = Theme.css(`
    margin-top: 0;
`)

export const s = {
	container,
	search,
	title
}
    