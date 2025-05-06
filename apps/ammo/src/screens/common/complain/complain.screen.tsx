import React from 'react';

import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { Button, KeyboardAwareScrollView, TextInput, Header } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';

import { useStyles } from './complain.style';
import { type IComplainScreenProps } from './complain.types';
import { complainVM } from './complain.vm';

export const ComplainScreen = observer(({ route }: IComplainScreenProps) => {
    const s = useStyles();
    const vm = useViewModel(complainVM, route?.params);
    const t = useTranslate('screens.complain');
    const tError = useTranslate('error');

    const text = vm.form.field('text');

    const onSubmit = () => vm.form.submit();

    return (
        <View style={s.container}>
            <Header backButton="back" title={t('title')} />
            <KeyboardAwareScrollView contentStyle={s.contentContainer}>
                <View style={s.content}>
                    <TextInput
                        label={t('textInput')}
                        testID="text"
                        onSubmitEditing={onSubmit}
                        returnKeyType="done"
                        {...text}
                        message={tError(text.error?.message, text.error)}
                        multiline
                        inputStyle={s.textInput}
                        contentStyle={s.containerTextInput}
                    />
                </View>
                <Button.Base title={t('button')} style={s.button} onPress={onSubmit} testID="submit" />
            </KeyboardAwareScrollView>
        </View>
    );
});
