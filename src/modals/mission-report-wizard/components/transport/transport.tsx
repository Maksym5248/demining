import { useCallback } from 'react';

import { Form} from 'antd';

import { Select } from '~/components'
import { MODALS, WIZARD_MODE } from '~/constants';
import { Modal } from '~/services';
import { ITransport, ITransportAction } from '~/stores';
import { select } from '~/utils';

interface TransportProps {
	dataHumans:ITransport[];
	dataExplosiveObject:ITransport[];
	selectedTransportHumanAction?: ITransportAction;
	selectedTransportExplosiveAction?: ITransportAction;
}

export function Transport({ dataHumans, dataExplosiveObject, selectedTransportHumanAction, selectedTransportExplosiveAction }: TransportProps ) {
	const onAdd = useCallback( () => {
		Modal.show(MODALS.TRANSPORT_WIZARD, { mode: WIZARD_MODE.CREATE})
	}, []);
	
	return <>
		<Form.Item
			label="Авто для ВР"
			name="transportExplosiveObjectId"
		>
			<Select
				options={select.append(
					dataExplosiveObject.map((el) => ({ label: el.fullName, value: el.id })),
					{ label: selectedTransportExplosiveAction?.fullName, value: selectedTransportExplosiveAction?.transportId }
				)}
				onAdd={onAdd}
			/>
		</Form.Item>
		<Form.Item
			label="Авто для О/С"
			name="transportHumansId"
		>
			<Select
				options={select.append(
					dataHumans.map((el) => ({ label: el.fullName, value: el.id })),
					{ label: selectedTransportHumanAction?.fullName, value: selectedTransportHumanAction?.transportId }
				)}
				onAdd={onAdd}
			/>
		</Form.Item>
	</>
}