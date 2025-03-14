import React, { useState, useEffect, memo } from 'react';

import { Updater } from '~/services';
import { type IUpdaterState } from '~/services/ui/updater';

import { Optional } from './components';

const Component = () => {
    const [data, setData] = useState<IUpdaterState[]>([]);

    const { id, isVisible, title, text, type, onLoad } = data[data.length - 1] ?? {
        id: '',
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
            <Optional id={id} isVisible={isVisibleOptional} title={title} text={text} onLoad={onLoad} />
        </>
    );
};

export const UpdaterProvider = memo(Component);
