import { OVERLAY_MOUSE_TARGET, OverlayViewF } from '@react-google-maps/api';
import { Typography } from 'antd';
import { type IPoint } from 'shared-my-client/map';

import { s } from './map-preview.style';

interface IMarkerCalloutProps {
    points: IPoint[];
}

export function PolygonCallout({ points }: IMarkerCalloutProps) {
    return (
        <>
            {points.map((point, index) => {
                const calloutText = index === 0 ? 'СТ' : `ТП${index}`;

                return (
                    <OverlayViewF key={calloutText} position={point} mapPaneName={OVERLAY_MOUSE_TARGET}>
                        <div css={[s.callout, s.calloutPolygon]}>
                            <Typography.Text css={[s.calloutText, s.calloutPolygonText]}>{calloutText}</Typography.Text>
                        </div>
                    </OverlayViewF>
                );
            })}
        </>
    );
}
