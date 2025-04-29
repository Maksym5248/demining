import React from 'react';

import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { Button, KeyboardAwareScrollView, TextInput, Header, Avatar } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';

import { useStyles } from './profile.style';
import { type IProfileScreenProps } from './profile.types';
import { profileVM } from './profile.vm';

export const ProfileScreen = observer(({ route }: IProfileScreenProps) => {
    const s = useStyles();
    const vm = useViewModel(profileVM, route?.params);
    const t = useTranslate('screens.profile');
    const tError = useTranslate('error');

    const name = vm.form.field('name');
    const photoUri = vm.form.field('photoUri');

    const onSubmit = () => vm.form.submit();

    return (
        <View style={s.container}>
            <Header backButton="back" title={t('title')} />
            <KeyboardAwareScrollView contentStyle={s.contentContainer}>
                <Avatar size={108} style={s.avatar} uri={photoUri.value || undefined} />
                <View style={s.content}>
                    <TextInput
                        label={t('name')}
                        autoComplete="name"
                        testID="name"
                        onSubmitEditing={onSubmit}
                        returnKeyType="done"
                        {...name}
                        message={tError(name.error?.message, name.error)}
                    />
                </View>
                <Button.Base title={t('button')} style={s.button} onPress={onSubmit} testID="submit" />
            </KeyboardAwareScrollView>
        </View>
    );
});
