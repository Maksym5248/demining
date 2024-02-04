import { Button, Form, Space } from 'antd';

interface WizardFooterProps {
	onCancel?: () => void;
	isView?: boolean;
	isEdit?: boolean;
}

export function WizardFooter({
	onCancel,
	isView,
	isEdit,
}: WizardFooterProps){	

	return isView
	 ?<div/>
	 : (
			<Form.Item label=" " colon={false}>
				<Space>
					<Button onClick={onCancel}>Скасувати</Button>
					<Button htmlType="submit" type="primary">
						{isEdit ? "Зберегти" : "Додати"}
					</Button>
				</Space>
			</Form.Item>
		);
}