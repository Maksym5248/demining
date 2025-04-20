import { Button } from 'antd';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '~/components';
import { ROUTES } from '~/constants';
import { useStore } from '~/hooks';

import { s } from './settings.styles';

export const SettingsPage = observer(() => {
    const store = useStore();
    const navigate = useNavigate();

    const onSignOut = async () => {
        await store.auth.signInOut.run();
        navigate(ROUTES.LOGIN);
    };

    return (
        <div css={s.container}>
            <Button type="primary" icon={<Icon.LogoutOutlined />} onClick={onSignOut}>
                Вийти
            </Button>
        </div>
    );
});
