import { useEffect, useState } from 'react';

import { Button, Image, Typography } from 'antd';
import { observer } from 'mobx-react';

import { Loading } from '~/components';
import { useStore } from '~/hooks';

import { s } from './books-pdf-assets.styles';
import { type IBooksPdfAssetsProps } from './books-pdf-assets.types';

export const BooksPdfAssets = observer(({ id, pageNumber: initialPageNUmber }: IBooksPdfAssetsProps) => {
    const { book } = useStore();
    const [pageNumber] = useState<number>(initialPageNUmber || 1);
    const assets = book.collectionAssets.get(id);

    useEffect(() => {
        book.fetchItem.run(id);
        book.fetchAssetsItem.run(id);
    }, []);

    const onClick = () => {
        book.createAssetsItem.run(id);
    };

    if (book.fetchItem.isLoading || book.fetchAssetsItem.isLoading) {
        return <Loading />;
    }

    console.log('pageAssets', assets);
    const pageAssets = assets?.getPage(pageNumber);

    const text = pageAssets?.items.filter(item => item.type === 'text');
    const images = pageAssets?.items.filter(item => item.type === 'image');
    console.log('pageAssets', pageNumber, assets?.getPage(pageNumber), text, images);

    return (
        <div css={s.container}>
            <Typography.Text css={s.title}>- {pageNumber} -</Typography.Text>
            {!assets && (
                <div css={s.loadButtonContainer}>
                    <Button onClick={onClick} loading={book.createAssetsItem.isLoading}>
                        Згенерувати компоненти
                    </Button>
                </div>
            )}
            {!!assets && (
                <>
                    <div css={s.texts}>{text?.map((item, index) => <p key={`text-${index}`}>{item.value}</p>)}</div>
                    <div css={s.images}>
                        {images?.map((item, index) => (
                            <Image key={`image-${index}`} src={item.value} alt={`Image ${index + 1}`} css={s.image} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});
