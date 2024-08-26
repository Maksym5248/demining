import { View, Text } from 'react-native';

import { useStyles } from './sign-up.style';

export const SignUpScreen = () => {
    const s = useStyles();

    return (
        <View style={s.container}>
            <Text>Sign Up Screen</Text>
        </View>
    );
};
