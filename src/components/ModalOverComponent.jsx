import { Popover, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useState } from 'react';
import AppModal from '@/components/AppModal';

function ModalOverComponent({
  children,
  maxLength,
  modalContent,
  childrenAsTrigger = false,
  tag = 'div',
  popoverText = 'Click to view full content.',
  modalOps = { width: 700 },
}) {
  const [modal, setModal] = useState({ cancelCSS: 'none', okText: 'OK' });
  const CustomTag = tag;
  if (maxLength && modalContent.length <= maxLength) {
    return <CustomTag>{modalContent}</CustomTag>;
  }

  return (
    <>
      {!childrenAsTrigger && <>{children}</>}
      <Popover content={popoverText} placement={'left'}>
        <div
          onClick={(e) => {
            e.preventDefault();
            setModal({
              ...modalOps,
              cancelCSS: 'none',
              className: '',
              body: modalContent,
              open: true,
            });
          }}
        >
          {!childrenAsTrigger && (
            <Button
              className="ant-btn-more"
              type="primary"
              shape="round"
              icon={<EllipsisOutlined style={{ fontSize: '24px' }} />}
              size={'small'}
            >
              View all
            </Button>
          )}
          {childrenAsTrigger && <>{children}</>}
        </div>
      </Popover>

      <AppModal modal={modal} setModal={setModal} />
    </>
  );
}

export default ModalOverComponent;
