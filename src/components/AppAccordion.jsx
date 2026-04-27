import Accordion from 'react-bootstrap/Accordion';
import InfoTooltip from "./form/InfoTooltip";

/**
 * Description placeholder
 *
 * @param {{ title: any; id: any; children: any; className?: string; tooltipTitle:any; toolTipPlacement:string; toolTipClassName: string; }} props
 * @param {string} props.title The title of the accordion
 * @param {string} props.id The css id of the accordion
 * @param {node} props.children
 * @param {string} [props.className='mt-4']
 * @param {string} props.tooltipTitle
 * @param {string} props.toolTipPlacement
 * @param {string} props.toolTipClassName
 * @returns {*}
 */
function AppAccordion({ title, id, children, className = 'mt-4', tooltipTitle,  toolTipPlacement, toolTipClassName}) {
  return (
    <div className={`c-accordion ${className}`}>
      <Accordion defaultActiveKey={id} id={id}>
        <Accordion.Item eventKey={id}>
          <Accordion.Header>{title} {tooltipTitle ? <InfoTooltip title={tooltipTitle} placement={toolTipPlacement} className={toolTipClassName}/> : null }</Accordion.Header>
          <Accordion.Body>{children}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default AppAccordion;
