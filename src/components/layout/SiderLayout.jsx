import React from 'react';
import AppNavBar from './AppNavBar';
import AppFooter from './AppFooter';
import { Row, Col, Container } from 'react-bootstrap';
import AppSider from './AppSider';
import SiderFacets from '../search/SiderFacets';


const SiderLayout = ({ children, prefixChildren, sider }) => {

  return (
    <div className='bg--dirtyWhite'>
      <AppNavBar />
      <Container fluid >
        <Row>
          <Col>
            {prefixChildren}
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
          {!sider && <SiderFacets />}
          {sider}
          </Col>
          <Col lg={9}>
            <main className='c-main container--card' >
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