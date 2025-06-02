import { observer } from 'mobx-react';
import { useItemStore } from 'shared-my-client';

import { Loading } from '~/components';
import { useStore } from '~/hooks';

import { type IBooksPdfAssetsProps } from './books-pdf-assets.types';
import { usePDF } from '../../usePDF';

export const BooksPdfAssets = observer(({ id }: IBooksPdfAssetsProps) => {
    const { book } = useStore();

    const current = useItemStore(book, id);
    const pdf = usePDF(current.item?.data.uri);

    if (current.isLoading || pdf.isLoading) {
        return <Loading />;
    }

    return <div />;
});
