import { Button, Typography, Space } from 'antd';

import { Icon, Search } from '~/components';

import { s } from './list-header.styles';

const { Title } = Typography;

interface ListHeaderProps {
	title: string;
	onCreate: (e: React.SyntheticEvent) => void;
	onSearch?: (value:string) => void;
	searchBy: string;
	setSearchBy:(value:string) => void;
}

export function ListHeader({ onCreate, onSearch, title, searchBy, setSearchBy }:ListHeaderProps) {
	const onClickCreate = (e: React.SyntheticEvent) => {
		e.preventDefault();
		onCreate(e);
	}

	return (
		<Space css={s.container}>
			<Title level={4} css={s.title}>{title}</Title>
			<Space css={s.search} style={{ justifyContent: "space-between" }}>
				{!!onSearch && <Search onSearch={onSearch} value={searchBy} onChangeValue={setSearchBy}/>}
				<Button type="primary" icon={<Icon.PlusOutlined />} onClick={onClickCreate}/>
			</Space>
		</Space>
	);
}