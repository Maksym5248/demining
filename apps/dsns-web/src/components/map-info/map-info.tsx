import { mathUtils } from '@/shared-client/common';
import { type IPoint } from '@/shared-client/map';
import { Divider, Typography, message } from 'antd';

import { s } from './map-info.style';

interface IMapInfoProps {
    point?: IPoint;
    area?: number;
    distance?: number;
}

export function MapInfo({ point, area, distance }: IMapInfoProps) {
    const onCopyCoords = () => {
        const text = `${point?.lat},${point?.lng}`;
        navigator.clipboard.writeText(text);
        message.success('Скопійовано');
    };

    const onCopyArea = () => {
        navigator.clipboard.writeText(String(area));
        message.success('Скопійовано');
    };

    const onCopyDistance = () => {
        navigator.clipboard.writeText(String(distance));
        message.success('Скопійовано');
    };

    return (
        <div css={s.container}>
            <div css={s.content}>
                <div css={s.group} onClick={onCopyDistance} role="button" tabIndex={0} onKeyDown={onCopyDistance}>
                    <Typography.Text css={s.areaItem}>Довжина: {distance ? `${distance}  м` : '-'}</Typography.Text>
                </div>
                <Divider type="vertical" css={s.divider} />
                <div css={s.group} onClick={onCopyArea} role="button" tabIndex={0} onKeyDown={onCopyArea}>
                    <Typography.Text css={s.areaItem}>Площа: {area ? `${area}  м2` : '-'}</Typography.Text>
                </div>
                <Divider type="vertical" css={s.divider} />
                <div css={s.group} onClick={onCopyCoords} role="button" tabIndex={0} onKeyDown={onCopyCoords}>
                    <Typography.Text css={s.coordsItem}>Lat: {mathUtils.toFixed(point?.lat, 9) ?? '-'}</Typography.Text>
                    <Typography.Text css={s.coordsItem}>Lng: {mathUtils.toFixed(point?.lng, 9) ?? '-'}</Typography.Text>
                </div>
            </div>
            <div css={s.hideGoogle} />
        </div>
    );
}
