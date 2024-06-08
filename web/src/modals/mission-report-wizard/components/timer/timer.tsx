import { Form, TimePicker } from 'antd';
import { Dayjs } from 'dayjs';

const getLastDate = (times: Dayjs[]) => {
    const [initial, ...rest] = times;

    if (!initial) {
        return undefined;
    }

    if (initial && !rest.length) {
        return initial;
    }

    return rest
        .filter((el) => !!el)
        .reduce((acc: Dayjs, c: Dayjs) => (acc.isAfter(c) ? acc : c), initial);
};

const generateArrayOfMinutes = () => new Array(12).fill(1).map((el, i) => i * 5);

const getDisabledHours = (...times: Dayjs[]) => {
    const lastDate = getLastDate(times);
    return new Array(lastDate?.hour() ?? 0).fill(1).map((el, i) => i);
};

const getDisabledMinutes = (selectedHour: number, ...times: Dayjs[]) => {
    const lastDate = getLastDate(times);

    if (selectedHour > (lastDate?.hour() ?? 0)) {
        return [];
    }

    if (selectedHour === lastDate?.hour()) {
        return generateArrayOfMinutes().filter((number) => number <= lastDate?.minute());
    }

    return generateArrayOfMinutes();
};

export function Timer() {
    return (
        <Form.Item noStyle shouldUpdate={() => true}>
            {({ getFieldValue }) => {
                const workStart = getFieldValue('workStart');
                const exclusionStart = getFieldValue('exclusionStart');
                const transportingStart = getFieldValue('transportingStart');
                const destroyedStart = getFieldValue('destroyedStart');

                return (
                    <>
                        <Form.Item
                            label="Початок"
                            name="workStart"
                            rules={[{ required: true, message: "Обов'язкове поле" }]}>
                            <TimePicker format="HH:mm" minuteStep={5} placeholder="Година" />
                        </Form.Item>
                        <Form.Item label="Виявлення" name="exclusionStart">
                            <TimePicker
                                format="HH:mm"
                                minuteStep={5}
                                placeholder="Година"
                                hideDisabledOptions
                                disabledTime={() => ({
                                    disabledHours: () => getDisabledHours(workStart),
                                    disabledMinutes: (selectedHour: number) =>
                                        getDisabledMinutes(selectedHour, workStart),
                                })}
                            />
                        </Form.Item>
                        <Form.Item label="Транспортування" name="transportingStart">
                            <TimePicker
                                format="HH:mm"
                                minuteStep={5}
                                hideDisabledOptions
                                placeholder="Година"
                                disabledTime={() => ({
                                    disabledHours: () =>
                                        getDisabledHours(workStart, exclusionStart),
                                    disabledMinutes: (selectedHour: number) =>
                                        getDisabledMinutes(selectedHour, workStart, exclusionStart),
                                })}
                            />
                        </Form.Item>
                        <Form.Item label="Знищення" name="destroyedStart">
                            <TimePicker
                                format="HH:mm"
                                minuteStep={5}
                                hideDisabledOptions
                                placeholder="Година"
                                disabledTime={() => ({
                                    disabledHours: () =>
                                        getDisabledHours(
                                            workStart,
                                            exclusionStart,
                                            transportingStart,
                                        ),
                                    disabledMinutes: (selectedHour: number) =>
                                        getDisabledMinutes(
                                            selectedHour,
                                            workStart,
                                            exclusionStart,
                                            transportingStart,
                                        ),
                                })}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Завершення"
                            name="workEnd"
                            rules={[{ required: true, message: "Обов'язкове поле" }]}>
                            <TimePicker
                                format="HH:mm"
                                minuteStep={5}
                                hideDisabledOptions
                                placeholder="Година"
                                disabledTime={() => ({
                                    disabledHours: () =>
                                        getDisabledHours(
                                            workStart,
                                            exclusionStart,
                                            transportingStart,
                                            destroyedStart,
                                        ),
                                    disabledMinutes: (selectedHour: number) =>
                                        getDisabledMinutes(
                                            selectedHour,
                                            workStart,
                                            exclusionStart,
                                            transportingStart,
                                            destroyedStart,
                                        ),
                                })}
                            />
                        </Form.Item>
                    </>
                );
            }}
        </Form.Item>
    );
}
