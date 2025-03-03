import { Form, InputNumber } from 'antd';
import { type IRangeData } from 'shared-my-client';

import { s } from './field-range.style';

interface IFieldRangeProps {
    label: string;
    name: string;
    min?: number;
    max?: number;
}

export const FieldRange = ({ label, name, min, max }: IFieldRangeProps) => {
    return (
        <Form.Item noStyle shouldUpdate={() => true}>
            {({ getFieldValue, setFieldValue }) => {
                const value = (getFieldValue(name) as IRangeData) ?? {};

                return (
                    <Form.Item label={label} name={name}>
                        <InputNumber
                            placeholder="Мін"
                            onChange={min => setFieldValue(name, { ...value, min })}
                            value={value?.min}
                            css={s.size}
                            min={min}
                            max={max}
                        />
                        <InputNumber
                            placeholder="Макс"
                            onChange={max => setFieldValue(name, { ...value, max })}
                            value={value?.max}
                            min={min}
                            max={max}
                        />
                    </Form.Item>
                );
            }}
        </Form.Item>
    );
};
