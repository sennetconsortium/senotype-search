import React from 'react';
import AppNavBar from './AppNavBar';
import AppFooter from './AppFooter';
import { Container } from 'react-bootstrap';

const BasicLayout = ({ children, fluid = true }) => {
  return (
    <div className="body__wrapper bg--dirtyWhite">
      <AppNavBar />
      <Container fluid={fluid}>
        <main className="c-main container--card">{children}</main>
      </Container>
      <AppFooter />
    </div>
  );
};
export default BasicLayout;
