import { Button, Radio, Tooltip, Popconfirm } from "antd";

import { s } from "./drawing-manager.style";
import { Icon } from "../../icon";
import { DrawingType } from "../map.types";

interface IDrawingManagerProps {
	value?: DrawingType;
	onChange?: (value: DrawingType) => void;
	onClear?: () => void;
	isDisabledClean?: boolean;
	isActiveStick?: boolean;
	onChangeStick?: (value: boolean) => void;
	isVisibleInArea?: boolean;
	isLoadingVisibleInArea?: boolean;
	onChangeVisibleInArea?: (value: boolean) => void;
}

export function DrawingManager({
	value,
	onChange,
	onClear,
	onChangeStick,
	onChangeVisibleInArea,
	isActiveStick,
	isDisabledClean,
	isVisibleInArea,
	isLoadingVisibleInArea
}: IDrawingManagerProps) {

	const _onChange = (e: any) => {
		onChange?.(e.target.value);
	}

	const _onChangeStick = () => {
		onChangeStick?.(!isActiveStick);
	}

	const _onChangeShowInArea = () => {
		onChangeVisibleInArea?.(!isVisibleInArea);
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
				<Tooltip placement="bottomRight" title="Показати обстежені ділянки в зоні" arrow>
					<Button
						size="large"
						loading={isLoadingVisibleInArea}
						onClick={_onChangeShowInArea}
						css={isVisibleInArea ? s.activeButton: undefined}
						icon={<Icon.GatewayOutlined /> }
					/>
				</Tooltip>
				<Tooltip placement="bottomRight" title="Прилипання" arrow>
					<Button
						size="large"
						onClick={_onChangeStick}
						css={isActiveStick ? s.activeButton: undefined}
						icon={<Icon.BuildOutlined /> }
					/>
				</Tooltip>
			</Button.Group>

			{!isDisabledClean && (
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
			)}
		</div>
	);
}