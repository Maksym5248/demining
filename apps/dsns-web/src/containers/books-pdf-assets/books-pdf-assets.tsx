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
    const item = book.collection.get(id);

    useEffect(() => {
        book.fetchItem.run(id);
    }, []);

    useEffect(() => {
        item?.fetchAssetPage.run(pageNumber);
    }, [pageNumber]);

    const onClick = () => {
        item?.createAssets.run(id);
    };

    if (book.fetchItem.isLoading || item?.fetchAssetPage.isLoading) {
        return <Loading />;
    }

    const pageAssets = item?.getAssetByPage(pageNumber);

    return (
        <div css={s.container}>
            <Typography.Text css={s.title}>- {pageNumber} -</Typography.Text>
            {!pageAssets && (item?.isErrorAssets || item?.isIdleAssets) && (
                <div css={s.loadButtonContainer}>
                    <Button onClick={onClick} loading={item?.createAssets.isLoading}>
                        Згенерувати компоненти
                    </Button>
                </div>
            )}
            {!pageAssets && !!item?.isErrorAssets && (
                <div css={s.errorText}>
                    <Typography.Text type="danger">Виникла помилка під час обробки книги. Спробуйте згенерувати їх ще раз.</Typography.Text>
                </div>
            )}
            {!!pageAssets && item?.isSuccessAssets && (
                <>
                    <div css={s.texts}>{pageAssets.data.texts?.map((text, index) => <p key={`text-${index}`}>{text}</p>)}</div>
                    <div css={s.images}>
                        {pageAssets.data.images?.map((url, index) => (
                            <Image key={`image-${index}`} src={url} alt={`Image ${index + 1}`} css={s.image} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});
