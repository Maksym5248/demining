import { Theme } from '~/styles';

const container = Theme.css(`
    position: relative;
    height: calc(100vh - 48px);
    width: 100%;
    overflow: hidden;
    display: flex;
    flex: 1;
    flex-direction: column;
`);

const content = Theme.css(`
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
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
    overflow-x: auto; // Enable horizontal scrolling for images
    border-top: 1px solid #d9d9d9;
    gap: 12px;
`);

const texts = Theme.css(`
    max-height: calc(100vh - 48px - 100px);
    overflow-y: auto;
    padding-left: 16px;
    padding-right: 16px;
`);

const image = Theme.css(`
    height: 100%;
    width: auto;
`);

const title = Theme.css(`
    align-self: center;
    text-align: center;
    font-size: 18px;
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
