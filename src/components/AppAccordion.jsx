import React from 'react';
import Accordion from 'react-bootstrap/Accordion';


/**
 * Description placeholder
 *
 * @param {{ title: any; id: any; children: any; className?: string; }} props 
 * @param {string} props.title The title of the accordion
 * @param {string} props.id The css id of the accordion
 * @param {node} props.children 
 * @param {string} [props.className='mt-4'] 
 * @returns {*} 
 */
function AppAccordion({ title, id, children, className = 'mt-4' }) {
  return (
    <div className={`c-accordion ${className}`}>
      <Accordion defaultActiveKey={id} id={id}>
        <Accordion.Item eventKey={id}>
          <Accordion.Header>{title}</Accordion.Header>
          <Accordion.Body>{children}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default AppAccordion;
