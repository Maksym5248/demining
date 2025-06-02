import { useState } from 'react';

import { useAsyncEffect } from 'shared-my-client';

import { cacheAsset } from './utils';

export const usePDF = (uri?: string) => {
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useAsyncEffect(async () => {
        try {
            if (!uri) return;
            setIsLoading(true);

            const blob = await cacheAsset(uri);
            if (blob) setPdfBlob(blob);
        } catch (e) {
            console.log('Fetching PDF blob for 3:', e);
        } finally {
            setIsLoading(false);
        }
    }, [uri]);

    return {
        isLoading,
        file: pdfBlob,
    };
};
