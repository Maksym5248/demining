import React from 'react';

import { Button, Space, Typography, message } from 'antd';
import { observer } from 'mobx-react-lite';

import { useStore } from '~/hooks';
import { DB } from '~/db';

import { s } from './dev.styles';

const { Title } = Typography;


 export const DevPage = observer(() => {
    const store = useStore();
    
    const onClickGenerateEmployee = () => {
      store.createMocks();
    }

    const onDropDb = async () => {
      try {
        await DB.dropDb();    
        message.success("Базу даних вдалено")
      } catch(e){
        message.error("Базу даних не вдалось видалити")
      }
    }

    return (
      <div>
        <Space css={s.titleContainer}>
            <Title level={4}>Development</Title>
        </Space>

        <div css={s.content}>
        <Space>
          <Button onClick={onClickGenerateEmployee}>
            Згенеруват дані о/c
          </Button>
        </Space>
        <Space>
          <Button onClick={onDropDb}>
            Вдалити базу даних
          </Button>
        </Space>
        </div>
      </div>
    );
  });