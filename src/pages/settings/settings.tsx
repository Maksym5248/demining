import { Button } from 'antd';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';

import { useStore } from '~/hooks';
import { Icon } from '~/components';
import { ROUTES } from '~/constants';

import { s } from './settings.styles';

export const SettingsPage  = observer(() => {
	const store = useStore();
	const navigate = useNavigate();

	const onSignOut = async () => {
		await store.auth.signInOut.run();
		navigate(ROUTES.AUTH)
	};

	return (
		<div css={s.container}>
			<Button type="primary" icon={<Icon.LogoutOutlined />} onClick={onSignOut} >
				Вийти
			</Button>
		</div>
	);
});