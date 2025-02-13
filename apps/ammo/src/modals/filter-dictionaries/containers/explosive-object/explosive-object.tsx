import { View } from 'react-native';

import { Select } from '~/core';
import { useViewModel } from '~/hooks';

import { useStyles } from './explosive-object.style';
import { explosiveObjectVM, type IExplosiveObjectVM } from './explosive-object.vm';

export const ExplosiveObject = () => {
    const s = useStyles();
    const vm = useViewModel<IExplosiveObjectVM>(explosiveObjectVM);

    const onPressSelect = () => {
        vm.openSelect();
    };

    return (
        <View style={s.container}>
            <Select onPress={onPressSelect} />
        </View>
    );
};
