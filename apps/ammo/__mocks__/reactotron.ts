export const trackGlobalErrors = jest.fn();
export const openInEditor = jest.fn();
export const setAsyncStorageHandler = () => ({
    configure: () => ({
        useReactNative: () => ({
            use: () => ({
                use: () => ({
                    connect: () => ({
                        createEnhancer: jest.fn(),
                    }),
                }),
            }),
        }),
    }),
});
