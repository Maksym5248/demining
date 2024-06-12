import { Form, Input, InputNumber } from 'antd';

import { s } from './territory.styles';

export function Territory() {
    return (
        <>
            <Form.Item label="Обстежено, м2" css={s.item}>
                <Form.Item name="checkedTerritory" css={s.first}>
                    <InputNumber size="middle" max={100000} />
                </Form.Item>
                <Form.Item name="depthExamination" label="на глибину, м" css={s.last}>
                    <InputNumber size="middle" step={0.01} min={0.01} max={10} />
                </Form.Item>
            </Form.Item>
            <Form.Item label="Не можливо обстежити, м2" css={s.item}>
                <Form.Item name="uncheckedTerritory" css={s.first}>
                    <InputNumber size="middle" min={1} max={100000} />
                </Form.Item>
            </Form.Item>
            <Form.Item label="Причина" name="uncheckedReason">
                <Input size="middle" />
            </Form.Item>
            <Form.Item label="Адреса" name="address" rules={[{ required: true, message: "Є обов'язковим полем" }]} css={s.item}>
                <Input.TextArea size="middle" />
            </Form.Item>
        </>
    );
}
