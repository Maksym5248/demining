import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';

import { MIME_TYPE } from '~/constants';

interface SelectTemplateProps {
	file: File | null;
	onRemove: () => void;
	customRequest: (options: { file: File }) => void;
}

export function UploadFile({ file, onRemove, customRequest }: SelectTemplateProps) {
	return (
		<Upload
			onRemove={onRemove}
			fileList={file ? [file as RcFile] : undefined}
			customRequest={(value) => customRequest && customRequest(value as { file: File})}
			maxCount={1}
			disabled={false}
			accept={MIME_TYPE.DOCX}
		 >
			<Button icon={<UploadOutlined />}>Вибрати шаблон</Button>
		</Upload>
	);
}