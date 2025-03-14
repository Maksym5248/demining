import React, { useState, useEffect, memo } from 'react';

import { Updater } from '~/services';
import { type IUpdaterState } from '~/services/ui/updater';

import { Optional } from './components';

const Component = () => {
    const [data, setData] = useState<IUpdaterState | null>();

    const { isVisible, title, text, type, onLoad } = data ?? {
        isVisible: false,
        title: '',
        text: '',
        type: 'optional',
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

    return (
        <>
            <Optional isVisible={isVisibleOptional} title={title} text={text} onLoad={onLoad} />
        </>
    );
};

export const UpdaterProvider = memo(Component);
