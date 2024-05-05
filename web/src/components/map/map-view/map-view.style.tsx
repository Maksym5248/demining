import { Theme } from '~/styles'

const container = Theme.css(({ token }) => (`
	position: relative;
	border-radius: 4px;
	overflow: hidden;
	border-radius: ${token.borderRadius}px;
	margin-bottom: -25px;
`));

const containerLoading = Theme.css(`
	display: flex;
	flex: 1;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
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

const calloutDivider = Theme.css(`
	background-color: #fff;
	margin: 0;
	height: 2px;
`);

const inputNumberContainer = Theme.css(`
	position: absolute;
	bottom: 60px;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	zIndex: 99999;
`);

const inputNumber = Theme.css(`
	width: 250px;
	background-color: #fff;
	border-radius: 4px;
`);


const mapContainerStyle = {
	width: '100%',
	height: '400px',
}

export const s = {
	container,
	containerLoading,
	deleteIcon,
	mapContainerStyle,
	drawingPanel,
	callout,
	calloutHeader,
	calloutText,
	calloutDivider,
	inputNumberContainer,
	inputNumber
}
    