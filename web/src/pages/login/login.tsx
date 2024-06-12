import { GoogleOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Spin, Typography } from 'antd';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { Icon } from '~/components';
import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';
import { error } from '~/utils';

import { s } from './login.styles';
import AppIcon from '../../../assets/icon.svg';

interface ILoginFrom {
    email: string;
    password: string;
}

export const LoginPage = observer(() => {
    const [form] = Form.useForm();
    const store = useStore();

    const handleGoogleSignIn = () => {
        store.auth.signInWithGoogle.run();
    };

    const onFinish = async (values: ILoginFrom) => {
        try {
            await store.auth.signInWithEmail.run(values.email, values.password);
        } catch (e) {
            const message = error.getErrorTranslation(store.auth.signInWithEmail.error);

            if (message) {
                form.setFields([
                    {
                        name: message?.field,
                        errors: [message?.message],
                    },
                ]);
            }
        }
    };

    const isLoading = store.auth.signInWithGoogle.isLoading || store.auth.signInWithEmail.isLoading || store.viewer.isLoading;

    return (
        <div css={s.container}>
            <AppIcon css={s.appIcon} />
            <div css={s.content}>
                <Typography.Title level={2} css={s.title}>
                    Увійти
                </Typography.Title>
                <Form form={form} name="login" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Введіть email' },
                            { type: 'email', message: 'Некоректний емейл' },
                        ]}>
                        <Input size="large" prefix={<Icon.UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Введіть пароль' },
                            { min: 6, message: 'Мінімальна кількість символів для пароля 6' },
                        ]}>
                        <Input.Password prefix={<Icon.LockOutlined />} size="large" type="password" placeholder="Пароль" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" className="login-form-button" css={s.button}>
                            Увійти
                        </Button>
                    </Form.Item>
                    <Typography.Paragraph style={{ marginTop: 16, textAlign: 'center' }}>
                        Немає акаунта? <Link to={ROUTES.SIGNUP}>Зареєструватись</Link>
                    </Typography.Paragraph>
                </Form>
                <Divider>Або</Divider>
                <Button type="primary" size="large" icon={<GoogleOutlined />} onClick={handleGoogleSignIn} css={s.buttonGoogle}>
                    Увійти з google
                </Button>
            </div>
            {isLoading && <Spin fullscreen size="large" />}
        </div>
    );
});
