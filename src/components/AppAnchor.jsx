import React, { useState } from 'react';
import { Anchor } from 'antd';
import AppFloatingButton from './AppFloatingButton';

const AppAnchor = ({
  items,
  offsetTop = 0,
  span,
  setSpan,
  anchorButtonStyle = { top: 350, left: 10, right: 'auto', bottom: 'auto' },
}) => {
  const [anchorVisible, setAnchorVisible] = useState(true);
  const toggleVisibility = () => {
    setAnchorVisible(!anchorVisible);
    setSpan(span === 20 ? 24 : 20);
  };

  return (
    <>
      <AppFloatingButton
        show={anchorVisible}
        onClick={toggleVisibility}
        text={'Sidebar'}
        buttonStyle={anchorButtonStyle}
      />

      {anchorVisible && <Anchor offsetTop={offsetTop} items={items} />}
    </>
  );
};

export default AppAnchor;
