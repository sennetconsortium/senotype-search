import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import EditorLibrary from '../EditorLibrary';
const { Content, Sider } = Layout;
import { Button } from 'react-bootstrap';

function AppSider({}) {
  const items = [
    {
      key: 'new',
      label: (
        <div>
          <Button className="w-100 pt-2">New</Button>
        </div>
      ),
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'Help',
      children: [
        {
          key: 'documentation',
          label: 'Documentation',
        },
      ],
    },
  ];

  return (
    <div className="c-appSider">
      <Sider
        className="mt-4 mb-4 container--card bg-white"
        breakpoint="lg"
        collapsedWidth="0"
        width={'100%'}
      >
        <EditorLibrary />
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
          items={items}
        />
      </Sider>
    </div>
  );
}

export default AppSider;
