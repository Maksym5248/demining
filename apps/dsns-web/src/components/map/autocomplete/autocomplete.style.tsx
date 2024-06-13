import { Theme } from '~/styles';

const autocomplete = Theme.css(`
	width: 340px;
	boxShadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	outline: none;
	textOverflow: ellipses;
	position: absolute;
	right: 16px;
	top: 16px;
`);

export const s = {
    autocomplete,
};
