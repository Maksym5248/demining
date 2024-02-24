import { Button } from 'antd';
import { observer } from 'mobx-react';
import { GoogleOutlined } from '@ant-design/icons';

import { useStore } from '~/hooks';

import { s } from './signup.styles';

export const SignupPage  = observer(() => {
	const store = useStore();

	const handleGoogleSignIn = () => {
		store.auth.signInWithGoogle.run();
	};

	return (
		<div css={s.container}>
			<Button type="primary" icon={<GoogleOutlined />} onClick={handleGoogleSignIn} />
		</div>
	);
});