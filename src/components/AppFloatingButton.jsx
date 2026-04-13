import { FloatButton } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import THEME from '@/lib/theme';


/**
 * Displays a floating button
 *
 * @param {{ show: any; setShow: any; onClick: any; text: any; buttonStyle?: { top: number; left: number; right: string; bottom: string; }; }} props 
 * @param {useState.boolean} props.show useState boolean variable
 * @param {useState.function} props.setShow useState method used to toggle the value of show
 * @param {function(event)} props.onClick A fuction to call on click of button
 * @param {string} props.text Text describing action
 * @param {{ top: number; left: number; right: string; bottom: string; }} [props.buttonStyle={ top: 350, left: 10, right: 'auto', bottom: 'auto' }] 
 * @returns {*} 
 */
function AppFloatingButton({
  show,
  setShow,
  onClick,
  text,
  buttonStyle = { top: 350, left: 10, right: 'auto', bottom: 'auto' },
}) {
  const handleOnClick = (e) => {
    if (!show && !THEME.isLgScreen()) {
      window.scrollTo(0, 0);
    }
    if (onClick) {
      onClick(e);
    } else {
      if (setShow) {
        setShow(!show);
      }
    }
  };
  return (
    <FloatButton
      onClick={(e) => handleOnClick(e)}
      style={buttonStyle}
      tooltip={show ? <div>Hide {text}</div> : <div>Show {text}</div>}
      icon={show ? <LeftCircleOutlined /> : <RightCircleOutlined />}
    />
  );
}

export default AppFloatingButton;
