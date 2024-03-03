import { Button, Divider, Form, Input, Spin, Typography } from 'antd';
import { observer } from 'mobx-react';
import { GoogleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { Icon } from "~/components"
import { useStore } from '~/hooks';
import { ROUTES } from '~/constants';

import AppIcon from '../../../assets/icon.svg';
import { s } from './signup.styles';

interface ISignInFrom {
	email: string;
	password: string;
}

export const SignupPage  = observer(() => {
	const store = useStore();

	const handleGoogleSignIn = () => {
		store.auth.signInWithGoogle.run();
	};

	const onFinish = async (values: ISignInFrom) => {
		store.auth.signUpWithEmail.run(values.email, values.password);
	};

	const isLoading = store.auth.signInWithGoogle.inProgress || store.auth.signInWithGoogle.inProgress;

	return (
		<div css={s.container}>
			<AppIcon css={s.appIcon}/>
			<div css={s.content}>
				<Typography.Title level={2} css={s.title}>Реєстрація</Typography.Title>
				<Form
					name="sign_in"
					onFinish={onFinish}
					autoComplete="off"
				>
					<Form.Item
						name="email"
						rules={[
							{ required: true, message: 'Введіть email'},
							{ type: "email", message: 'Некоректний емейл'}
						]}
					>
						<Input
							size="large"
							prefix={<Icon.UserOutlined />}
							placeholder="Email"
						/>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[
							{ required: true, message: 'Введіть пароль'},
							{ min: 6, message: 'Мінімальна кількість символів для пароля 6',  }
						]}
					>
						<Input.Password
							prefix={<Icon.LockOutlined />}
							size="large"
							type="password"
							placeholder="Пароль"
						/>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" size="large" className="login-form-button" css={s.button}>
							Зареєструватись
						</Button>
					</Form.Item>
					<Typography.Paragraph style={{ marginTop: 16, textAlign: 'center' }}>
						Вже є акаунт? <Link to={ROUTES.SIGNUP}>Увійти</Link>
					</Typography.Paragraph>
				</Form>
				<Divider>Або</Divider>
				<Button type="primary" size="large" icon={<GoogleOutlined />} onClick={handleGoogleSignIn} css={s.buttonGoogle}>
					Зареєструватись з google
				</Button>
			</div>
			{isLoading && <Spin fullscreen size="large" />}
		</div>
	);
});