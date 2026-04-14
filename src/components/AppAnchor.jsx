import React, { useState, useEffect, useCallback, useEffectEvent } from 'react';
import { Anchor } from 'antd';
import AppFloatingButton from './AppFloatingButton';
import THEME from '@/lib/theme';

const AppAnchor = ({
  items,
  offsetTop = 0,
  span,
  setSpan,
  anchorButtonStyle = { top: 350, left: 10, right: 'auto', bottom: 'auto' },
}) => {
  const [anchorVisible, setAnchorVisible] = useState(true);
  const [affix, setAffix] = useState(true);

  const toggleVisibility = () => {
    setAnchorVisible(!anchorVisible);
    setSpan(span === 10 ? 12 : 10);
  };

  const updatePosition = useEffectEvent(() => {
    setAffix(THEME.isLgScreen());
  });

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  return (
    <div className={`c-anchor mb-4`}>
      <AppFloatingButton
        show={anchorVisible}
        onClick={toggleVisibility}
        text={'Sidebar'}
        buttonStyle={anchorButtonStyle}
      />

      {anchorVisible && (
        <Anchor affix={affix} offsetTop={offsetTop} items={items} />
      )}
    </div>
  );
};

export default AppAnchor;
