import React from 'react';

import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { Button, KeyboardAwareScrollView, TextInput, Header, Avatar, Icon, Loading } from '~/core';
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
    const onUpdateImage = () => vm.updateImage.run();
    const onOpenGallery = () => vm.openAvatarInGallery();

    return (
        <View style={s.container}>
            <Header backButton="back" title={t('title')} />
            <KeyboardAwareScrollView contentStyle={s.contentContainer}>
                <View style={s.avatarContainer}>
                    <Avatar
                        size={108}
                        style={s.avatar}
                        uri={photoUri.value || undefined}
                        onPress={photoUri.value ? onOpenGallery : undefined}
                    />
                    {vm.updateImage.isLoading && <Loading size="large" isVisible style={[s.avatar, s.loading]} />}
                    {!vm.updateImage.isLoading && <Icon name="edit" style={s.buttonEdit} onPress={onUpdateImage} />}
                </View>
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
