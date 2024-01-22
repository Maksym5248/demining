import { JSXElementConstructor, ReactElement, useCallback } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Space} from 'antd';

import { Select } from '~/components'
import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { ITransport } from '~/stores';

interface TransportProps {
	dataHumans:ITransport[];
	dataExplosiveObject:ITransport[]
}

export function Transport({ dataHumans, dataExplosiveObject }: TransportProps ) {
	const onAdd = useCallback( () => {
		Modal.show(MODALS.TRANSPORT_CREATE)
	}, []);
	
	const dropdownRender = useCallback(
		(menu:ReactElement<any, string | JSXElementConstructor<any>>) => (
			<>
				{menu}
				<Divider style={{ margin: '8px 0' }} />
				<Space style={{ padding: '0 8px 4px' }}>
					<Button type="text" icon={<PlusOutlined />} onClick={onAdd}>Додати</Button>
				</Space>
			</>
		),[onAdd]
	);
	
	return <>
		<Form.Item
			label="Авто для ВР"
			name="transportExplosiveObjectId"
		>
			<Select
				options={dataExplosiveObject.map((el) => ({ label: el.fullName, value: el.id }))}
				dropdownRender={dropdownRender}
			/>
		</Form.Item>
		<Form.Item
			label="Авто для О/С"
			name="transportHumansId"
		>
			<Select
				options={dataHumans.map((el) => ({ label: el.fullName, value: el.id }))}
				dropdownRender={dropdownRender}
			/>
		</Form.Item>
	</>
}