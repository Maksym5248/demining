import { Theme } from '~/styles'

const first = Theme.css(`
    display: inline-block;
`)

const last = Theme.css(`
    display: inline-block;
    margin: 0 0 0 8px;
`);

const item = Theme.css(`
    margin-bottom: 0px
`);

export const s = {
	first,
	last,
	item
}
    