import { Form, InputNumber } from 'antd';
import { type ISizeData } from 'shared-my-client';

import { s } from './field-size.style';

interface Props {
    name: string | number;
    label?: string;
}

export const FieldSize = ({ name, label = 'Розмір, мм' }: Props) => {
    return (
        <Form.Item noStyle shouldUpdate={() => true}>
            {({ getFieldValue, setFieldValue }) => {
                const size = (getFieldValue(name) as ISizeData) ?? {};
                return (
                    <Form.Item label={label} name={name}>
                        <InputNumber
                            placeholder="Довжина/діаметр"
                            onChange={length => setFieldValue(name, { ...size, length })}
                            value={size?.length}
                            min={0}
                        />
                        <InputNumber
                            placeholder="Ширина"
                            css={s.size}
                            onChange={width => setFieldValue(name, { ...size, width })}
                            value={size?.width}
                            min={0}
                        />
                        <InputNumber
                            placeholder="Висота"
                            onChange={height => setFieldValue(name, { ...size, height })}
                            value={size?.height}
                            min={0}
                        />
                    </Form.Item>
                );
            }}
        </Form.Item>
    );
};
