import { Button } from 'antd';
import { observer } from 'mobx-react';

import { useStore } from '~/hooks';
import { Icon } from '~/components';

import { s } from './settings.styles';

export const SettingsPage  = observer(() => {
	const store = useStore();

	const onSignOut = () => {
		store.auth.signInOut.run();
	};

	return (
		<div css={s.container}>
			<Button type="primary" icon={<Icon.LogoutOutlined />} onClick={onSignOut} >
				Вийти
			</Button>
		</div>
	);
});