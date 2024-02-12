// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom';
import { configure } from 'mobx';

global.console.error = jest.fn();

// adds possibility to spy on MobX action.bounds
configure({ safeDescriptors: false });
