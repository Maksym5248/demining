import { Theme } from '~/styles'

const button = Theme.css(`
	cursor: pointer;
	background-color: #fff;
`);

const zoomView = Theme.css(`
	position: absolute;
	right: 8px;
	bottom: 60px;
	display: flex;
	flex-direction: column;
`);

const buttonZoomIn = Theme.css(`
	border-top-right-radius: 0;
	border-top-left-radius: 0;
`);

const buttonZoomOut = Theme.css(`
	border-bottom-right-radius: 0;
	border-bottom-left-radius: 0;	
`);

export const s = {
	button,
	zoomView,
	buttonZoomIn,
	buttonZoomOut
}
    