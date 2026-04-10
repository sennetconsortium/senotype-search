import React from 'react';
import AppNavBar from './AppNavBar';
import AppFooter from './AppFooter';
import { Row, Col, Container } from 'react-bootstrap';
import SiderFacets from '@/components/search/SiderFacets';

const SiderLayout = ({ children, prefixChildren, sider, showSider = true }) => {
  return (
    <div className="body__wrapper bg--dirtyWhite">
      <AppNavBar />
      <Container fluid>
        <Row>
          <Col>{prefixChildren}</Col>
        </Row>
        <Row>
          {showSider && (
            <Col lg={2}>
              {!sider && <SiderFacets />}
              {sider}
            </Col>
          )}
          <Col lg={showSider ? 10 : 12}>
            <main className="c-main container--card">{children}</main>
          </Col>
        </Row>
      </Container>
      <AppFooter />
    </div>
  );
};
export default SiderLayout;
