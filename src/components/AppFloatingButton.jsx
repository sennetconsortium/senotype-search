import { FloatButton } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';

function AppFloatingButton({
  show,
  setShow,
  onClick,
  text,
  buttonStyle = { top: 350, left: 10, right: 'auto', bottom: 'auto' },
}) {
  return (
    <FloatButton
      onClick={(e) => (onClick ? onClick(e) : setShow(!show))}
      style={buttonStyle}
      tooltip={show ? <div>Hide {text}</div> : <div>Show {text}</div>}
      icon={show ? <LeftCircleOutlined /> : <RightCircleOutlined />}
    />
  );
}

export default AppFloatingButton;
