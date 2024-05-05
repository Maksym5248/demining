import { Theme } from '~/styles'

const modal = Theme.css(`
    display: : flex;
    flex: 1;
    min-height: 100vh;
`)

const header = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    height: 60px;
    border-bottom: solid 1px grey;
`)

export const s = {
	modal,
	header,
}
    