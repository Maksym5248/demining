import { TreeSelect as TreeSelectAntd, type TreeSelectProps } from 'antd';
import { observer } from 'mobx-react-lite';

type Props = TreeSelectProps;

export const TreeSelect = observer(({ treeData, ...props }: Props) => {
    return (
        <TreeSelectAntd
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            treeData={treeData}
            {...props}
        />
    );
});
