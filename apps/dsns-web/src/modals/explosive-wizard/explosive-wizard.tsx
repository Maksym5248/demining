import { Form, Drawer, Input, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { EXPLOSIVE_TYPE } from 'shared-my/db';
import { useItemStore } from 'shared-my-client/common';

import { WizardButtons, Select, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './explosive-wizard.style';
import { type IExplosiveForm } from './explosive-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

const typeOptions = [
    {
        label: 'Вибухова речовна',
        value: EXPLOSIVE_TYPE.EXPLOSIVE,
    },
    {
        label: 'Засіб підриву',
        value: EXPLOSIVE_TYPE.DETONATOR,
    },
];

export const ExplosiveWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });

    const { isLoading, item } = useItemStore(store.explosive, id as string);

    const isEdit = !!id;

    const onFinishCreate = async (values: IExplosiveForm) => {
        await store.explosive.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveForm) => {
        await item?.update.run(values);
        hide();
    };

    const onRemove = async () => {
        !!id && store.explosive.remove.run(id);
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} ВР та ЗП`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="explosive-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={item ? { ...item.data } : { type: EXPLOSIVE_TYPE.EXPLOSIVE }}>
                    <Form.Item label="Тип" name="type" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select options={typeOptions} />
                    </Form.Item>
                    <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Прізвище є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
