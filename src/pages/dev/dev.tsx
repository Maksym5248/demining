import React from 'react';

import { Button, Space, Typography, Layout } from 'antd';
import { observer } from 'mobx-react-lite';

import { useStore } from '~/hooks';

import { s } from './dev.styles';

const { Title } = Typography;


 export const DevPage = observer(() => {
    const store = useStore();
    
    const onClickGenerateEmployee = () => {
      store.createMocks();
    }

    return (
      <div>
        <Space css={s.titleContainer}>
            <Title level={4}>Development</Title>
        </Space>
        <Button onClick={onClickGenerateEmployee}>
           Згенеруват дані о/c
        </Button>
      </div>
    );
  });