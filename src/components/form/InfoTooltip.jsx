import {Tooltip} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";

/**
 * @param {{ title: any; placement?: string; className?: string; }} props
 * @param {string} props.title The text in the tooltip
 * @param {string} [props.placement='top'] The placement of the tooltip
 * @param {string} [props.className='ms-2']
 * @returns {*}
 */
export default function InfoTooltip({title, placement='top', className = 'ms-2'}) {
    return (
        <Tooltip placement={placement} title={title} >
            <InfoCircleOutlined className={className}/>
        </Tooltip>
    )
}