import * as Icons from '@ant-design/icons';
import CustomIcon from '@ant-design/icons';
import { type AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type Props = React.ForwardRefExoticComponent<Partial<AntdIconProps>>;
interface IIcon {
    [key: string]: Props;
}

function SvgPolygon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
            <polygon points="0,4 0,12 8,16 16,12 16,4 8,0 " />
        </svg>
    );
}

function SvgCircle() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
            <circle cx="8" cy="8" r="8" />
        </svg>
    );
}

function SvgCursor() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="1em" height="1em" fill="currentColor">
            <path
                d="M25,7c-0.4,0-0.8,0.1-1.1,0.2C23.5,5.9,22.4,5,21,5c-0.4,0-0.8,0.1-1.1,0.2C19.5,3.9,18.4,3,17,3s-2.5,0.9-2.9,2.2
				C13.8,5.1,13.4,5,13,5c-1.7,0-3,1.3-3,3v9.2l-1.1-1.9c-0.4-0.7-1.1-1.2-1.9-1.4c-0.8-0.2-1.6,0-2.3,0.4c-1.1,0.8-1.6,2.2-1.1,3.5
				c1.7,4.4,4.5,9.2,7.6,12.9c0.2,0.2,0.5,0.3,0.8,0.3h13c0.4,0,0.8-0.2,0.9-0.6C27.3,27.2,28,23,28,18v-8C28,8.3,26.7,7,25,7z M26,18
				c0,4.4-0.6,8.1-1.7,11H12.5c-2.9-3.4-5.5-7.9-7-11.9c-0.2-0.4,0-0.9,0.4-1.1c0.2-0.1,0.5-0.2,0.7-0.1c0.3,0.1,0.5,0.2,0.6,0.4l3,5.2
				c0.2,0.4,0.7,0.6,1.1,0.5c0.4-0.1,0.7-0.5,0.7-1V8c0-0.6,0.4-1,1-1s1,0.4,1,1v10c0,0.6,0.4,1,1,1s1-0.4,1-1V8V6c0-0.6,0.4-1,1-1
				s1,0.4,1,1v2v10c0,0.6,0.4,1,1,1s1-0.4,1-1V8c0-0.6,0.4-1,1-1s1,0.4,1,1v2v8c0,0.6,0.4,1,1,1s1-0.4,1-1v-8c0-0.6,0.4-1,1-1
				s1,0.4,1,1V18z"
            />
        </svg>
    );
}

function SvgMarker() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 438.536 438.536" width="1em" height="1em" fill="currentColor">
            <path
                d="M322.621,42.825C294.073,14.272,259.619,0,219.268,0c-40.353,0-74.803,14.275-103.353,42.825
		c-28.549,28.549-42.825,63-42.825,103.353c0,20.749,3.14,37.782,9.419,51.106l104.21,220.986
		c2.856,6.276,7.283,11.225,13.278,14.838c5.996,3.617,12.419,5.428,19.273,5.428c6.852,0,13.278-1.811,19.273-5.428
		c5.996-3.613,10.513-8.562,13.559-14.838l103.918-220.986c6.282-13.324,9.424-30.358,9.424-51.106
		C365.449,105.825,351.176,71.378,322.621,42.825z M270.942,197.855c-14.273,14.272-31.497,21.411-51.674,21.411
		s-37.401-7.139-51.678-21.411c-14.275-14.277-21.414-31.501-21.414-51.678c0-20.175,7.139-37.402,21.414-51.675
		c14.277-14.275,31.504-21.414,51.678-21.414c20.177,0,37.401,7.139,51.674,21.414c14.274,14.272,21.413,31.5,21.413,51.675
		C292.355,166.352,285.217,183.575,270.942,197.855z"
            />
        </svg>
    );
}

const Polygon = function (props: Props) {
    return <CustomIcon component={SvgPolygon} {...props} />;
};

const Circle = function (props: Props) {
    return <CustomIcon component={SvgCircle} {...props} />;
};

const Cursor = function (props: Props) {
    return <CustomIcon component={SvgCursor} {...props} />;
};

const Marker = function (props: Props) {
    return <CustomIcon component={SvgMarker} {...props} />;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Icon = {
    ...(Icons as unknown as IIcon),
    Polygon,
    Circle,
    Cursor,
    Marker,
} as IIcon;
