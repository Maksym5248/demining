import { Theme } from '~/styles'

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
	backgroundColor: #fff;
	zIndex: 99999;
`);


const mapContainerStyle = {
	width: '100%',
	height: '400px',
}

export const s = {
	container,
	autocomplete,
	deleteIcon,
	mapContainerStyle,
	drawingPanel
}
    