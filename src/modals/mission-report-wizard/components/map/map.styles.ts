import { MAP_SIZE } from '~/constants';
import { Theme } from '~/styles'

export const MAP_PADDING_TOP = 40;
export const MAP_PADDING_BOTTOM = 20;

const container = Theme.css(`
    display: flex;
    gap: 8px;
    height: ${MAP_SIZE.MEDIUM_HEIGHT}px;
    margin-top: ${MAP_PADDING_TOP}px;
`);

export const s = {
	container
}
    