import { Popover, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useState } from 'react';
import AppModal from '@/components/AppModal';

/**
 * Allows for using a modal for any overflowing content.
 *
 * @param {{ children: any; maxLength: any; modalContent: any; childrenAsTrigger?: boolean; tag?: string; popoverText?: string; modalOps?: { width: number; }; }} props
 * @param {node} props.children
 * @param {number} props.maxLength If modalContent is a string, checks length of string against this max specified value.
 * @param {string|node} props.modalContent
 * @param {boolean} [props.childrenAsTrigger=false] Whether the children of the component is used trigger for opening modal
 * @param {string} [props.tag='div'] A custom tag for displaying modalContent when it doesn't go beyond maxContent
 * @param {string} [props.popoverText='Click to view full content.']
 * @param {{ width: number; }} [props.modalOps={ width: 700 }]
 * @returns {*}
 */
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
  if (maxLength && modalContent?.length <= maxLength) {
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
