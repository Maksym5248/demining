import { Theme } from '~/styles'

const container = Theme.css(`
	display: flex;
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;
	display: flex;
	flex-direction: column;
`);


const content = Theme.css(({ token }) => (`
	padding: 0 8px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	align-self: flex-end;
	background: ${token.colorBgBase};
	border: 1px solid ${token.colorBorderBg};
	border-radius: ${token.borderRadius}px;
	margin: 0 8px 8px 0;
	gap: 16px;
`));

const group = Theme.css(({ token }) => (`
	display: flex;
	&:hover {
		cursor: pointer;
		&>span {
			color: ${token.colorPrimary};
		}
	}
	white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`));

const divider = Theme.css(({ token }) => (`
	display: flex;
	flex: 1;
	background: ${token.colorIcon};
`));

const areaItem = Theme.css(({ token }) => (`
	color: ${token.colorWhite};
	width: 200px;
	color: ${token.colorIcon};
`));

const coordsItem = Theme.css(({ token }) => (`
	color: ${token.colorWhite};
	width: 140px;
	color: ${token.colorIcon};
`));

const hideGoogle = Theme.css(({ token }) => (`
	height: 22px;
	width: 100%;
	background: ${token.colorBorderBg};
`))

export const s = {
	container,
	content,
	group,
	coordsItem,
	areaItem,
	hideGoogle,
	divider
}
    