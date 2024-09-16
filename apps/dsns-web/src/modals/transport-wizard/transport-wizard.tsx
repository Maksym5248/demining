import { Form, Drawer, Input, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { TRANSPORT_TYPE } from 'shared-my';

import { WizardButtons, Select, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './transport-wizard.style';
import { type ITransportForm } from './transport-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const typeOptions = [
    {
        label: 'Для перевезення о/c',
        value: TRANSPORT_TYPE.FOR_HUMANS,
    },
    {
        label: 'Для перевезення ВНП',
        value: TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS,
    },
];

export const TransportWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });

    const transport = store.transport.collection.get(id ?? '');

    const isEdit = !!id;
    const isLoading = !store.transport.fetchList.isLoaded && store.transport.fetchList.isLoading;

    const onFinishCreate = async (values: ITransportForm) => {
        await store.transport.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: ITransportForm) => {
        await transport?.update.run(values);
        hide();
    };

    const onRemove = async () => {
        !!id && store.transport.remove.run(id);
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} транспорт`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="transport-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={transport ? { ...transport.data } : { type: TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS }}>
                    <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Прізвище є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item
                        label="Номер автомобіля"
                        name="number"
                        rules={[{ required: true, message: "Прізвище є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <Form.Item label="Тип" name="type" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select options={typeOptions} />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
