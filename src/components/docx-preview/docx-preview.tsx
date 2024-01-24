import * as docx from 'docx-preview';

import { fileUtils } from '~/utils/file';
import { MIME_TYPE } from '~/constants';
import { useAsyncEffect } from '~/hooks';
import { Logger } from '~/services';

interface DocxPreviewProps {
	file: File | null;
}

export function DocxPreview({ file }: DocxPreviewProps) {
	
	useAsyncEffect(async () => {
		if(!file){
			return
		}

		try {
			await docx.renderAsync(
				fileUtils.fileToBlob(file, MIME_TYPE.DOCX),
				document.getElementById("docx-preview-component") as HTMLElement
			)
		} catch(e) {
			Logger.error(e)
		}
	}, [file])

	
	return (
		<div id="docx-preview-component"/>
	);
}