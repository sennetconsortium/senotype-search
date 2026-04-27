import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function AppSpinner({fullscreen = true, otherProps = {}}) {
  return (
    <Spin
      indicator={<LoadingOutlined spin />}
      percent={'auto'}
      fullscreen={fullscreen}
      {...otherProps}
    ></Spin>
  );
}

export default AppSpinner;
