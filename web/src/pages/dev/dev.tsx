import { Button, Space, Typography } from 'antd';
import { observer } from 'mobx-react-lite';

import { Loading } from '~/components';
import { useStore } from '~/hooks';

import { s } from './dev.styles';
import { mockEmployees, mockMissionRequest, mockEquipment, mockTransport } from './mock-data';

const { Title } = Typography;

export const DevPage = observer(() => {
    const store = useStore();

    const onClickGenerateEmployee = () => {
        mockEmployees.forEach((el) => {
            store.employee.create.run(el);
        });

        mockMissionRequest.forEach((el) => {
            store.missionRequest.create.run(el);
        });

        mockTransport.forEach((el) => {
            store.transport.create.run(el);
        });

        mockEquipment.forEach((el) => {
            store.equipment.create.run(el);
        });
    };

    const onCreateExplosiveObjects = async () => {
        store.explosiveObject.createExplosiveObjects.run();
    };

    return (
        <div>
            <Space css={s.titleContainer}>
                <Title level={4}>Development</Title>
            </Space>

            <div css={s.content}>
                {store.explosiveObject.createExplosiveObjects.inProgress ? (
                    <Loading />
                ) : (
                    <>
                        <Space>
                            <Button onClick={onClickGenerateEmployee}>Згенеруват дані о/c</Button>
                        </Space>
                        <Space>
                            <Button onClick={onCreateExplosiveObjects}>Створити ВНП</Button>
                        </Space>
                    </>
                )}
            </div>
        </div>
    );
});
