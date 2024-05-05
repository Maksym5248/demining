import { Button } from "antd";

import { s } from "./map-zoom-view.style";
import { Icon } from "../icon";

interface IMapZoomViewProps {
	zoom: number;
	onChange: (zoom: number) => void;
}

export function MapZoomView({
	zoom,
	onChange,
}: IMapZoomViewProps) {
	const onZoomIn = () => {
		onChange(zoom - 1)
	};

	const onZoomOut = () => {
		onChange(zoom + 1)
	};

	return  (
		<div css={s.zoomView}>
			<Button
				onClick={onZoomOut}
				icon={<Icon.PlusOutlined />}
				css={[s.button, s.buttonZoomOut]}
			/>
			<Button
				css={[s.button, s.buttonZoomIn]}
				icon={<Icon.MinusOutlined />}
				onClick={onZoomIn}
			/>
		</div>
	);
}