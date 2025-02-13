import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Select } from '~/core';

import { useStyles } from './explosive-object.style';
import { type IExplosiveObjectProps } from './explosive-object.type';

export const ExplosiveObject = observer(({ model }: IExplosiveObjectProps) => {
    const s = useStyles();

    const onPressSelect = () => {
        model.openSelect();
    };

    return (
        <View style={s.container}>
            <Select onPress={onPressSelect} value={model.typeName} />
        </View>
    );
});
