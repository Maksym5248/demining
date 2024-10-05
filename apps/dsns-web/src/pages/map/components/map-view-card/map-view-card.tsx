import { Button, Card, Typography } from 'antd';
import { observer } from 'mobx-react-lite';

import { Icon } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';

import { s } from './map-view-card.style';

const { Text } = Typography;

export interface IMapViewCardProps {
    selectedId: string;
    onClose: (selectedId: string) => void;
}

function Component({ selectedId, onClose }: IMapViewCardProps) {
    const store = useStore();

    const mapViewAction = store.map.collection.get(selectedId);
    const missionReport = store.missionReport.collection.get(mapViewAction?.data?.documentId);
    const { missionRequest, order } = missionReport ?? {};

    const _onClose = () => {
        onClose(selectedId);
    };

    const onOpenMissionReport = () => {
        Modal.show(MODALS.MISSION_REPORT_WIZARD, { id: missionReport?.data.id, mode: WIZARD_MODE.VIEW });
    };

    const onOpenMissionRequest = () => {
        Modal.show(MODALS.MISSION_REQUEST_WIZARD, { id: missionRequest?.data.id, mode: WIZARD_MODE.VIEW });
    };

    const onOpenOrder = () => {
        Modal.show(MODALS.ORDER_WIZARD, { id: order?.data.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <Card css={s.container} title="Деталі" size="small" loading={store.missionReport.fetchItem.isLoading}>
            <Icon.CloseOutlined onClick={_onClose} css={s.close} />
            <div css={s.row}>
                <Button type="link" css={s.button} onClick={onOpenMissionReport}>
                    Акт:{' '}
                </Button>
                <Text type="secondary" ellipsis>
                    №{missionReport?.numberView} від {missionReport?.data.executedAt.format('DD.MM.YYYY')}
                </Text>
            </div>
            <div css={s.row}>
                <Button type="link" css={s.button} onClick={onOpenMissionRequest}>
                    Підстава:{' '}
                </Button>
                <Text type="secondary" ellipsis>
                    № {missionRequest?.data.number} від {missionRequest?.data.signedAt.format('DD.MM.YYYY')}, {missionRequest?.displayType}
                </Text>
            </div>
            <div css={s.row}>
                <Button type="link" css={s.button} onClick={onOpenOrder}>
                    Наказ:{' '}
                </Button>
                <Text type="secondary" ellipsis>
                    №{order?.data.number} від {order?.data.signedAt.format('DD.MM.YYYY')}
                </Text>
            </div>
            <div css={s.row}>
                <Button type="text" css={s.button}>
                    Адреса:{' '}
                </Button>
                <Text type="secondary" ellipsis>
                    {missionReport?.data.address}
                </Text>
            </div>
        </Card>
    );
}

export const MapViewCard = observer(Component);
