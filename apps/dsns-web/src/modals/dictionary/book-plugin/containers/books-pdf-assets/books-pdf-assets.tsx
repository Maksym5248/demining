import { useEffect, useState } from 'react';

import { Image, Typography } from 'antd';
import { observer } from 'mobx-react';

import { Loading } from '~/components';
import { useStore } from '~/hooks';

import { type IBooksPdfAssetsProps } from './books-pdf-assets.types';

export const BooksPdfAssets = observer(({ id, pageNumber: initialPageNUmber }: IBooksPdfAssetsProps) => {
    const { book } = useStore();
    const [pageNumber] = useState<number>(initialPageNUmber || 1);
    const item = book.collection.get(id);
    const assets = book.collectionAssets.get(id);

    useEffect(() => {
        book.fetchItem.run(id);
        book.loadAssetsItem.run(id);
    }, []);

    if (book.fetchItem.isLoading || book.loadAssetsItem.isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <Typography.Title level={4}>
                {item?.displayName} - Page {pageNumber}
            </Typography.Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {assets?.getPage(pageNumber)?.items.map((item, index) => {
                    if (item.type === 'image') {
                        return (
                            <Image key={index} src={item.value} alt={`Image ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
                        );
                    }

                    return <p key={index}>{item.value}</p>;
                })}
            </div>
        </div>
    );
});
