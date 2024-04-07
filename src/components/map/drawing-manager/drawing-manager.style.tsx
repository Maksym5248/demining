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

const activeButton = Theme.css(({ token }) => `
	border-color: ${token.colorPrimary};
	color: ${token.colorPrimary};
`);

export const s = {
	container,
	button,
	activeButton,
}
    