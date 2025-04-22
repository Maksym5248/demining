import '@ant-design/v5-patch-for-react-19';

import * as Sentry from '@sentry/react';
import { unstableSetRender } from 'antd';
import { createRoot } from 'react-dom/client';

import { App } from './app';

const container = document.getElementById('root') as HTMLElement;

unstableSetRender((node, container) => {
    // @ts-ignore
    container._reactRoot ||= createRoot(container);
    // @ts-ignore
    const root = container._reactRoot;
    root.render(node);
    return async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
        root.unmount();
    };
});

const root = createRoot(container, {
    // Callback called when an error is thrown and not caught by an ErrorBoundary.
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
        console.warn('Uncaught error', error, errorInfo.componentStack);
    }),
    // Callback called when React catches an error in an ErrorBoundary.
    onCaughtError: Sentry.reactErrorHandler(),
    // Callback called when React automatically recovers from errors.
    onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(<App />);
