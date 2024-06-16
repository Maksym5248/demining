import { type IPoint } from '@/shared-client';
import { OVERLAY_MOUSE_TARGET, Polyline, OverlayViewF } from '@react-google-maps/api';
import { Divider, Typography } from 'antd';
import { type Dayjs } from 'dayjs';

import { useMapOptions } from '~/hooks';

import { s } from './map-preview.style';

interface IMarkerCalloutProps {
    marker?: IPoint;
    callout?: IPoint;
    date?: Dayjs;
    explosiveObjects?: string[];
}

export function MarkerCallout({ date, explosiveObjects, marker, callout }: IMarkerCalloutProps) {
    const { polylineOptions } = useMapOptions({ isPictureType: true });

    return !!callout && !!explosiveObjects && !!marker ? (
        <>
            <OverlayViewF position={callout} mapPaneName={OVERLAY_MOUSE_TARGET}>
                <div css={s.callout}>
                    <div css={s.calloutHeader}>
                        {explosiveObjects.map((el, i) => (
                            <Typography.Text key={i} css={s.calloutText}>
                                {el}
                            </Typography.Text>
                        ))}
                    </div>
                    <Divider css={s.calloutDivider} />
                    <Typography.Text css={s.calloutText}>{date?.format('DD.MM.YYYY')}</Typography.Text>
                </div>
            </OverlayViewF>
            <Polyline options={polylineOptions} path={[marker, callout]} />
        </>
    ) : null;
}
