import { Theme } from '~/styles';

const container = Theme.css(`
    min-height: 80vh;
    display: flex;
    flex-direction: column;
`);

const content = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
`);

const loadButtonContainer = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`);

const images = Theme.css(`
    display: flex;
    flex: 1;
    max-height: 100px;
    overflow-y: auto;
    border-top: 1px solid #d9d9d9;
    gap: 12px;
`);

const texts = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-x: auto;
`);

const image = Theme.css(`
    max-height: 100px;
    width: auto;
`);

const title = Theme.css(`
    align-self: center;
    text-align: center;
    font-size: 24px;
`);

export const s = {
    title,
    content,
    container,
    loadButtonContainer,
    image,
    images,
    texts,
};
