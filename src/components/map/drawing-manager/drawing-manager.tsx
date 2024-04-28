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
	canVisibleInArea?: boolean;
	onChangeVisibleInArea?: (value: boolean) => void;
	onToggleMapType?: () => void;
	mapTypeId?: google.maps.MapTypeId;
}

export function DrawingManager({
	canVisibleInArea,
	value,
	onChange,
	onClear,
	onChangeStick,
	onChangeVisibleInArea,
	isActiveStick,
	isDisabledClean,
	isVisibleInArea,
	isLoadingVisibleInArea,
	onToggleMapType,
	mapTypeId
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
	
	const getClassShowArea = () => {
		if(!canVisibleInArea){
			return s.disabledButton;
		}

		if(isVisibleInArea){
			return s.activeButton;
		}
		
		return undefined;
	}

	return (
		<div css={s.container}>
			<Button.Group>
				<Tooltip placement="bottomRight" title="Показати умовні позначення" arrow>
					<Button
						onClick={onToggleMapType}
						icon={<Icon.TagOutlined /> }
						disabled={false}
						css={[
							s.button,
							mapTypeId === google.maps.MapTypeId.HYBRID ? s.activeButton : undefined
						]}
					/>
				</Tooltip>
				<Tooltip placement="bottomRight" title="Показати обстежені ділянки в зоні" arrow>
					<Button
						loading={isLoadingVisibleInArea && canVisibleInArea}
						onClick={canVisibleInArea ?_onChangeShowInArea : undefined}
						css={getClassShowArea()}
						icon={<Icon.GatewayOutlined /> }
					/>
				</Tooltip>
				<Tooltip placement="bottomRight" title="Прилипання" arrow>
					<Button
						onClick={_onChangeStick}
						css={isActiveStick ? s.activeButton: undefined}
						icon={<Icon.BuildOutlined /> }
					/>
				</Tooltip>
			</Button.Group>
			
			<Radio.Group value={value} onChange={_onChange}>
				<Radio.Button value={DrawingType.MOVE} css={s.button}><Icon.Cursor /></Radio.Button>
				<Radio.Button value={DrawingType.MARKER} css={s.button}><Icon.Marker /></Radio.Button>
				<Radio.Button value={DrawingType.CIRCLE} css={s.button}><Icon.Circle /></Radio.Button>
				<Radio.Button value={DrawingType.LINE} css={s.button}><Icon.ShareAltOutlined /></Radio.Button>
				<Radio.Button value={DrawingType.POLYGON} css={s.button}><Icon.Polygon /></Radio.Button>
			</Radio.Group>

		

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
							danger
							icon={<Icon.ClearOutlined /> }
						/>
					</Popconfirm>
				</Tooltip>
			)}
		</div>
	);
}