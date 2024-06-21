import { useEffect, useState } from 'react';

import { Card, Radio, type RadioChangeEvent, Spin, DatePicker } from 'antd';
import { type Dayjs } from 'dayjs';
import { observer } from 'mobx-react';
import { dates } from 'shared-my-client/common';

import { useStore } from '~/hooks';

import { s } from './home.styles';

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

const options = [
    { label: 'День', value: dates.startOfDay().valueOf(), id: 'day' },
    { label: 'Тиждень', value: dates.startOfWeek().valueOf() + 1, id: 'week' },
    { label: 'Місяць', value: dates.startOfMonth().valueOf() + 2, id: 'month' },
    { label: 'Рік', value: dates.startOfYear().valueOf() + 3, id: 'year' },
];

export const HomePage = observer(() => {
    const store = useStore();
    const [startDate, setStartDate] = useState(dates.startOfDay());
    const [endDate, setEndDate] = useState(dates.endOfDay());

    const onChange = ({ target: { value } }: RadioChangeEvent) => {
        setStartDate(dates.create(value));
    };

    const onSelectDates = (value: RangeValue) => {
        if (value?.[0]) {
            setStartDate(value?.[0]);
        }

        if (value?.[1]) {
            setEndDate(value?.[1]);
        }
    };

    useEffect(() => {
        store.explosiveObject.fetchSum.run(startDate, endDate);
        store.explosive.fetchSum.run(startDate, endDate);
        store.missionReport.fetchSum.run(startDate, endDate);
        store.missionRequest.fetchSum.run(startDate, endDate);
    }, [startDate, endDate]);

    const isLoading =
        store.explosiveObject.fetchSum.isLoading ||
        store.explosive.fetchSum.isLoading ||
        store.missionReport.fetchSum.isLoading ||
        store.missionRequest.fetchSum.isLoading;

    return (
        <div css={s.container}>
            <div css={s.header}>
                <Radio.Group options={options} onChange={onChange} value={startDate.valueOf()} optionType="button" buttonStyle="solid" />
                <RangePicker value={[startDate, endDate]} format="YYYY-MM-DD" onChange={onSelectDates} />
            </div>
            <div css={s.mainData}>
                <Card title={`ВНП: ${store.explosiveObject.sum.total}`} css={s.card}>
                    <p>Виявлено: {store.explosiveObject.sum.discovered}</p>
                    <p>Транспортовано: {store.explosiveObject.sum.transported}</p>
                    <p>Знищено: {store.explosiveObject.sum.destroyed}</p>
                </Card>
                <Card title="ВР та ЗП" css={s.card}>
                    <p>ВР: {store.explosive.sum.explosive} кг.</p>
                    <p>ЗП: {store.explosive.sum.detonator} од.</p>
                </Card>
                <Card title="Виконано" css={s.card}>
                    <p>Акт: {store.missionReport.sum.total}</p>
                    <p>Заявка: {store.missionRequest.sum.total}</p>
                </Card>
            </div>

            {isLoading && <Spin fullscreen size="large" />}
        </div>
    );
});
