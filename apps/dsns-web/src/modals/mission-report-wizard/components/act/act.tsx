import { Form, DatePicker, InputNumber } from 'antd';

import { s } from './act.styles';

export function Act() {
    return (
        <>
            <Form.Item label="Номер акту" rules={[{ required: true, message: "Обов'язкове поле" }]} css={s.item}>
                <Form.Item name="number" rules={[{ required: true, message: "Обов'язкове поле" }]} css={s.first}>
                    <InputNumber size="middle" min={1} max={100000} />
                </Form.Item>
                <Form.Item name="subNumber" css={s.last}>
                    <InputNumber size="middle" min={1} max={100000} />
                </Form.Item>
            </Form.Item>
            <Form.Item
                label="Дата виконання"
                name="executedAt"
                rules={[{ required: true, message: "Дата виконання є обов'язковим полем" }]}>
                <DatePicker />
            </Form.Item>
        </>
    );
}
