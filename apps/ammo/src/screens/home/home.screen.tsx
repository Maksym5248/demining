import { View, Text } from 'react-native';

import { useStyles } from './home.style';

export const HomeScreen = () => {
    const s = useStyles();

    return (
        <View style={s.container}>
            <Text>Sign Up Screen</Text>
        </View>
    );
};
