import { Button, Radio, Tooltip, Popconfirm } from "antd";

import { s } from "./drawing-manager.style";
import { Icon } from "../../icon";
import { DrawingType } from "../map.types";

interface IDrawingManagerProps {
	value?: DrawingType;
	onChange?: (value: DrawingType) => void;
	onClear?: () => void;
}


export function DrawingManager({
	value,
	onChange,
	onClear,
}: IDrawingManagerProps) {

	const _onChange = (e: any) => {
		onChange?.(e.target.value);
	}

	const _onClear = () => {
		onClear?.();
	}
	
	return (
		<div css={s.container}>
			<Radio.Group value={value} onChange={_onChange} size="large">
				<Radio.Button value={DrawingType.MOVE} css={s.button}><Icon.Cursor /></Radio.Button>
				<Radio.Button value={DrawingType.MARKER} css={s.button}><Icon.Marker /></Radio.Button>
				<Radio.Button value={DrawingType.CIRCLE} css={s.button}><Icon.Circle /></Radio.Button>
				<Radio.Button value={DrawingType.POLYGON} css={s.button}><Icon.Polygon /></Radio.Button>
			</Radio.Group>

			<Button.Group>
				<Tooltip placement="bottomRight" title="Очистити" arrow>
					<Popconfirm
						title="Очистити"
						description="Підтвердити очищення елементів на карті"
						onConfirm={_onClear}
						okText="Так"
						cancelText="Ні"
					
					>
						<Button
							size="large"
							danger
							icon={<Icon.ClearOutlined /> }
						/>
					</Popconfirm>
				</Tooltip>
			</Button.Group>
		</div>
	);
}