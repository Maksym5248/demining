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

const disabledButton = Theme.css(({ token }) => `
	background: ${token.colorBorder};
	border-color: ${token.colorBorder};
`);

export const s = {
	container,
	button,
	activeButton,
	disabledButton
}
    