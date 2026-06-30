import { useContext, useState } from 'react';
import AppNavBar from './AppNavBar';
import AppFooter from './AppFooter';
import { Row, Col, Container } from 'react-bootstrap';
import SiderFacets from '@/components/search/SiderFacets';
import Draggable from '@/components/Draggable';
import AppFloatingButton from '@/components/AppFloatingButton';

/**
 * Layout for displaying a left sider content alongside main content
 *
 * @param {{ children: any; firstRowPrefixChildren: any; sider: any; showSider?: boolean; classNameMain?: string; }} props
 * @param {node} props.children Component to display in main area
 * @param {node} props.firstRowPrefixChildren The children to display before the flex sider and main content
 * @param {node} props.sider The sider component to display
 * @param {boolean} [props.showSider=true] Whether to include the sider or not
 * @param {string} [props.classNameMain='']
 * @returns {*}
 */
const SiderLayout = ({
  children,
  siderCollapsible = true,
  firstRowPrefixChildren,
  sider,
  classNameMain = '',
}) => {
  const [showSider, setShowSider] = useState(true);
  return (
    <div className="body__wrapper bg--dirtyWhite">
      <AppNavBar />
      <Container fluid> 
        {siderCollapsible && <Draggable>
            <AppFloatingButton
              show={showSider}
              freestyle={true}
              setShow={setShowSider}
              text={'Search Facets'}
              buttonStyle={{}}
            />
          </Draggable>}
        <Row>
          <Col>{firstRowPrefixChildren}</Col>
        </Row>
        <Row className='container__row2'>
         
          {showSider && (
            <Col lg={3}>
              {!sider && <SiderFacets />}
              {sider}
            </Col>
          )}
          <Col lg={showSider ? 9 : 12}>
            <main className={`c-main container--card ${classNameMain}`}>
              {children}
            </main>
          </Col>
        </Row>
      </Container>
      <AppFooter />
    </div>
  );
};
export default SiderLayout;
