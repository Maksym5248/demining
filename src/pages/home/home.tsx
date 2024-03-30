import { useEffect, useState } from 'react';

import { Card, Radio, RadioChangeEvent, Spin, DatePicker } from 'antd';
import { observer } from 'mobx-react';
import { Dayjs } from 'dayjs';

import { useStore } from '~/hooks';
import { dates } from '~/utils';

import { s } from './home.styles';

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

const options = [
	{ label: 'День', value: dates.startOfDay().valueOf() },
	{ label: 'Тиждень', value: dates.startOfWeek().valueOf() },
	{ label: 'Місяць', value: dates.startOfMonth().valueOf() },
	{ label: 'Рік', value: dates.startOfYear().valueOf() },
];
  
export const HomePage  = observer(() => {
	const store = useStore();
	const [startDate, setStartDate] = useState(dates.startOfDay());
	const [endDate, setEndDate] = useState(dates.endOfDay());

	const onChange = ({ target: { value } }: RadioChangeEvent) => {
		setStartDate(dates.create(value));
	};

	const onSelectDates = (value: RangeValue) => {
		if(value?.[0]){
			setStartDate(value?.[0])
		}

		if(value?.[1]){
			setEndDate(value?.[1])
		}
	};

	useEffect(() => {
		store.explosiveObject.fetchCount.run(startDate, endDate);
	}, [startDate, endDate]);

	const isLoading = store.explosiveObject.fetchCount.inProgress;
	const { count } = store.explosiveObject;

	return (
		<div css={s.container}>
			<div css={s.header}>
				<Radio.Group
					options={options}
					onChange={onChange}
					value={startDate.valueOf()}
					optionType="button"
					buttonStyle="solid"
				/>
				<RangePicker
					value={[startDate, endDate]}
					format="YYYY-MM-DD"
					onOk={onSelectDates}
				/>
			</div>
			<div css={s.mainData}>
				<Card title={`ВНП: ${count.total}`} css={s.card}>
					<p>Виявлено: {count.discovered}</p>
					<p>Транспортовано: {count.discovered}</p>
					<p>Знищено: {count.discovered}</p>
				</Card>
				<Card title="ВР та ЗП" css={s.card}>
					<p>Card content</p>
					<p>Card content</p>
					<p>Card content</p>
				</Card>
				<Card title="Виконано" css={s.card}>
					<p>Card content</p>
					<p>Card content</p>
					<p>Card content</p>
				</Card>
			</div>
		
			{isLoading && <Spin fullscreen size="large" />}
		</div>
	);
});