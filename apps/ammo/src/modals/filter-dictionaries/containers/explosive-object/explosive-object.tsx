import { View } from 'react-native';

import { useStyles } from './explosive-object.style';

export const ExplosiveObject = () => {
    const s = useStyles();

    return <View style={s.container} />;
};
