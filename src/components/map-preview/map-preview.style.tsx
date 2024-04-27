import { Theme } from '~/styles'

export const polygonCalloutHeight = 20;
export const polygonCalloutWidth = 35;

const container = Theme.css(`
	position: relative;
`);

const autocomplete = Theme.css(`
	width: 340px;
	height: 38px;
	boxShadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	outline: none;
	textOverflow: ellipses;
	position: absolute;
	right: 11px;
	top: 11px;
`);

const deleteIcon = Theme.css(`
	cursor: pointer;
	height: 24px;
	width: 24px;
`);

const drawingPanel = Theme.css(`
	position: absolute;
	height: 24px;
	width: 24px;
	top: 100px;
	background-color: #fff;
	zIndex: 99999;
`);

const callout = Theme.css(`
	position: relative;
	min-height: 50px;
	max-width: 250px;
	zIndex: 99999;
`);

const calloutPolygon = Theme.css(`
	min-height: ${polygonCalloutHeight}px;
	height: ${polygonCalloutHeight}px;
	width: ${polygonCalloutWidth}px;
	background: #ffebbb;
	padding: 0 2px;
	border-radius: 2px;
	text-align: center;
	justify-content: center;
	transform: translate(-50%, -50%);
`);

const calloutCity = Theme.css(`
	position: absolute;
	left: 8px;
	top: 50px;
	min-height: ${polygonCalloutHeight}px;
	height: ${polygonCalloutHeight}px;
	background: #ffebbb;
	padding: 0 10px;
	border-radius: 2px;
	text-align: center;
	justify-content: center;
`);

const calloutHeader = Theme.css(`
	position: absolute;
	top: 0;
	width: 100%;
	transform: translateY(-100%);
`);

const calloutText = Theme.css(`
	color: #fff;
	clear: both;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
`);

const calloutPolygonText = Theme.css(`
	color: #000;
`);

const calloutDivider = Theme.css(`
	background-color: #fff;
	margin: 0;
	height: 2px;
`);

const button = Theme.css(`
	cursor: pointer;
	background-color: #fff;
`);

const panel = Theme.css(`
	position: absolute;
	top: 8px;
	right: 8px;
	left: 8px;
	zIndex: 99999;
	display: flex;
	gap: 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`);


const mapContainerStyle = {
	width: '100%',
	height: '400px',
}

const activeButton = Theme.css(({ token }) => `
	border-color: ${token.colorPrimary};
	color: ${token.colorPrimary};
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
	container,
	autocomplete,
	deleteIcon,
	mapContainerStyle,
	drawingPanel,
	callout,
	calloutPolygon,
	calloutHeader,
	calloutText,
	calloutPolygonText,
	calloutDivider,
	calloutCity,
	panel,
	button,
	activeButton,
	zoomView,
	buttonZoomIn,
	buttonZoomOut
}
    