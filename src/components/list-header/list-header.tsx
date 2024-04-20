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
	onOpenInfo?:() => void;
}

export function ListHeader({ onCreate, onSearch, title, searchBy, setSearchBy, onOpenInfo }:ListHeaderProps) {
	const onClickCreate = (e: React.SyntheticEvent) => {
		e.preventDefault();
		onCreate(e);
	}

	return (
		<Space css={s.container}>
			<Title level={4} css={s.title}>{title}</Title>
			<Space css={s.search} style={{ justifyContent: "space-between" }}>
				{!!onSearch && <Search onSearch={onSearch} value={searchBy} onChangeValue={setSearchBy}/>}
				<div css={s.buttons}>
					{!!onOpenInfo && <Button icon={<Icon.InfoCircleOutlined />} onClick={onOpenInfo}/>}
					<Button type="primary" icon={<Icon.PlusOutlined />} onClick={onClickCreate}/>
				</div>
			</Space>
		</Space>
	);
}