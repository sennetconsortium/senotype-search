import { Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

function ClipboardCopy({children, text, title = 'Copy SenNet ID to clipboard', className = '', size= 12}) {

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text)
    }

    return (
      <Tooltip placement="top" trigger="click" title={'Copied!'} className={`${className} popover-clipboard`}>
            <sup title={title.replace('{text}', text)} role={'button'} onClick={copyToClipboard}>
                {!children && <CopyOutlined />}
                {children}
            </sup>
      </Tooltip>
    )
}

export default ClipboardCopy