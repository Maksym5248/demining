
import { Divider, Typography, message } from "antd";

import { IPoint } from "~/types";
import { mathUtils } from "~/utils";

import { s } from "./map-info.style";

interface IMapInfoProps {
	marker?: IPoint;
	area?: number;
}

export function MapInfo({
	marker,
	area,
}: IMapInfoProps) {

	const onCopyCoords = () => {
		const text = `${marker?.lat},${marker?.lng}`;
		navigator.clipboard.writeText(text);
		message.success("Скопійовано");
	}

	const onCopyArea = () => {
		navigator.clipboard.writeText(String(area));
		message.success("Скопійовано");
	}

	return (
		<div css={s.container}>
			<div css={s.content}>
				<div css={s.group} onClick={onCopyArea} role="button" tabIndex={0} onKeyDown={onCopyArea}>
					<Typography.Text css={s.areaItem}>
						Площа: {area ? `${area}  м2`: "-"}
					</Typography.Text>
				</div>
				<Divider type="vertical" css={s.divider}/>
				<div css={s.group} onClick={onCopyCoords} role="button" tabIndex={0} onKeyDown={onCopyCoords}>
					<Typography.Text css={s.coordsItem}>
						Lat: {mathUtils.toFixed(marker?.lat, 9) ?? "-"}
					</Typography.Text>
					<Typography.Text css={s.coordsItem}>
						Lng: {mathUtils.toFixed(marker?.lng, 9) ?? "-"}
					</Typography.Text>
				</div>
			</div>
			<div css={s.hideGoogle} />
		</div>
	);
}
