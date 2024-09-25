import { useRef } from 'react';

import isEqual from 'lodash/isEqual';

export const useOnChange = (callBack: () => void, props: any[]) => {
    const prevProps = useRef(props);

    if (!isEqual(props, prevProps)) {
        callBack();
        prevProps.current = props;
    }
};
