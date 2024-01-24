import { useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';

import  { FileSystem, Logger } from "~/services"
import { useAsyncEffect } from '~/hooks';
import { MIME_TYPE } from '~/constants';

export function SelectTemplate() {
	const [template, setTemplate] = useState<RcFile | null>(null);

	const onRemove = async () => {
		try {
			await FileSystem.removeTemplate();
			setTemplate(null);
		} catch (error) {
			Logger.error("SelectTemplate - onRemove: ", error)
		}
	}

	const beforeUpload = async (file: RcFile) => {
		setTemplate(file);
	}

	const customRequest = async (value: any) => {
		try {
			await FileSystem.saveTemplate(value?.file as File)
		} catch (error) {
			setTemplate(null);
			Logger.error("SelectTemplate - customRequest: ", error)
		}
	}

	useAsyncEffect(async () => {
		try {
			const file = await FileSystem.readTemplate();
			if(file){
				setTemplate(file as RcFile);
			}
		} catch (e) {
			Logger.error("SelectTemplate - readTemplate: ", e)
		}
	}, []);

	return (
		<Upload
			onRemove={onRemove}
			fileList={template ? [template] : undefined}
			customRequest={customRequest}
			beforeUpload={beforeUpload}
			maxCount={1}
			disabled={false}
			accept={MIME_TYPE.DOCX}
		 >
			<Button icon={<UploadOutlined />}>Вибрати шаблон</Button>
		</Upload>
	);
}