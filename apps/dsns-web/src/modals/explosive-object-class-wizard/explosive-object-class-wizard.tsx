import { Form, Drawer, Input, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { useItemStore } from 'shared-my-client';

import { WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { s } from './explosive-object-class-wizard.style';
import { type IExplosiveObjectClassForm } from './explosive-object-class-wizard.types';

interface Props {
    id?: string;
    typeId: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

export const ExplosiveObjectClassWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });

    const { isLoading, item } = useItemStore(store.explosiveObject.class, id as string);

    const isEdit = !!id;

    const onFinishCreate = async (values: IExplosiveObjectClassForm) => {
        await store.explosiveObject.class.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IExplosiveObjectClassForm) => {
        await item?.update.run(values);
        hide();
    };

    const onRemove = async () => {
        !!id && store.explosiveObject.class.remove.run(id);
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} класифікацію`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="explosive-object-class"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={item ? { ...item.data } : {}}>
                    <Form.Item label="Назва" name="name" rules={[{ required: true, message: "Є обов'язковим полем" }]}>
                        <Input placeholder="Введіть дані" />
                    </Form.Item>
                    <WizardFooter
                        {...wizard}
                        onCancel={hide}
                        onRemove={onRemove}
                        isLoading={item?.update.isLoading || store.explosiveObject.class.create.isLoading}
                    />
                </Form>
            )}
        </Drawer>
    );
});
