import { View, Text } from 'react-native';

import { useStyles } from './sign-in.style';

export const SignInScreen = () => {
    const s = useStyles();

    return (
        <View style={s.container}>
            <Text>Sign In Screen</Text>
        </View>
    );
};
