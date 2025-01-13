import { TreeSelect as TreeSelectAntd, type TreeSelectProps } from 'antd';
import { observer } from 'mobx-react-lite';

type Props = TreeSelectProps;
interface TreeSelectComponent extends React.FC<Props> {
    SHOW_PARENT: typeof TreeSelectAntd.SHOW_PARENT;
}

export const TreeSelect: TreeSelectComponent = observer(({ treeData, ...props }: Props) => {
    return (
        <TreeSelectAntd
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Вибрати"
            allowClear
            treeDefaultExpandAll
            treeData={treeData}
            {...props}
        />
    );
}) as TreeSelectComponent;

TreeSelect.SHOW_PARENT = TreeSelectAntd.SHOW_PARENT;
