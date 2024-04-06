import { Theme } from '~/styles'

const container = Theme.css(`
	position: absolute;
	top: 16px;
	left: 16px;
	display: flex;
	gap: 16px;
`);

const button = Theme.css(({ token }) => `
	color: ${token.colorIcon};
`);

export const s = {
	container,
	button,
}
    