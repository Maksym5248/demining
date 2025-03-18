import React, { useState, useEffect, memo } from 'react';

import { Updater } from '~/services';
import { type IUpdaterState } from '~/services/ui/updater';

import { Optional, Forced } from './components';

const Component = () => {
    const [data, setData] = useState<IUpdaterState[]>([]);

    const { id, link, isVisible, title, text, type, onLoad } = data?.find(el => el.type === 'forced') ??
        data[0] ?? {
            id: '',
            isVisible: false,
            title: '',
            text: '',
            type: undefined,
            link: '',
            onLoad: () => Promise.resolve(),
        };

    useEffect(() => {
        const removeListener = Updater.onChange(newData => {
            setData(newData);
        });

        return () => {
            removeListener();
        };
    }, []);

    const isVisibleOptional = isVisible && type === 'optional';
    const isVisibleForced = isVisible && type === 'forced';
    const params = {
        id,
        link,
        title,
        text,
        onLoad,
    };

    return (
        <>
            <Optional {...params} isVisible={isVisibleOptional} />
            <Forced {...params} isVisible={isVisibleForced} />
        </>
    );
};

export const UpdaterProvider = memo(Component);
