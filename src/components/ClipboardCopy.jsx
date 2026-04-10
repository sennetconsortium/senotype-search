import { useRef, useState } from 'react';
import { Tooltip } from 'antd';

function ClipboardCopy({
  children,
  text,
  title = 'Copy SenNet ID to clipboard',
  className = '',
  size = 12,
  timeout = 1000,
  tag = 'sup',
}) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);

    if (newOpen) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setOpen(false);
      }, timeout);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const CustomTag = tag;

  return (
    <Tooltip
      open={open}
      onOpenChange={handleOpenChange}
      placement="top"
      trigger="click"
      title={'Copied!'}
      className={`${className} popover-clipboard`}
    >
      <CustomTag
        title={title.replace('{text}', text)}
        role={'button'}
        onClick={copyToClipboard}
      >
        &nbsp;
        {!children && (
          <i className="bi bi-clipboard" style={{ fontSize: size }}></i>
        )}
        {children}
      </CustomTag>
    </Tooltip>
  );
}

export default ClipboardCopy;
