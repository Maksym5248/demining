import { Typography } from 'antd';

import { s } from './waiting-approve.styles';
import AppIcon from '../../../../assets/icon.svg';

export function WaitingApprovePage() {
    return (
        <div css={s.container}>
            <AppIcon css={s.appIcon} />
            <div css={s.content}>
                <Typography.Title level={2} css={s.title}>
                    Очікуйте підтвердження
                </Typography.Title>
                <Typography.Paragraph css={s.text}>
                    Ви не входите до жодної з організацій, зверніться до адміністратора організаії, щоб він додав вас.
                </Typography.Paragraph>
            </div>
        </div>
    );
}
