import { Spin } from "antd";

import { s } from "./loading.styles";

export function Loading() {
	return <Spin css={s.spin} />
}