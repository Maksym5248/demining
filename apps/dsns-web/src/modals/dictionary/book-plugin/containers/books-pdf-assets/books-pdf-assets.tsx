import { useEffect } from 'react';

import { observer } from 'mobx-react';

import { useStore, useSearch } from '~/hooks';

export const BooksPdfAssets = observer(() => {
    const { book } = useStore();
    const search = useSearch();

    useEffect(() => {
        book.fetchList.run(search?.searchValue);
    }, []);

    return <div />;
});
