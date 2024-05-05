import { Theme } from '~/styles'

const modal = Theme.css(`
    display: : flex;
    flex: 1;
    width: 80vh;
	height: 80vh;
    position: relative;
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
    