import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'next/image';
import ENVS from '@/lib/envs';
import AppContext from '@/context/AppContext';
import ClipboardCopy from '../ClipboardCopy';
import URLS from '@/lib/urls';

function AppNavBar() {
  const { auth } = useContext(AppContext);
  return (
    <Navbar expand="lg" className="c-header" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="/">
          <Image
            alt={ENVS.app.name}
            src="/imgs/editor.png"
            width="30"
            height="30"
            className="w-fixed d-inline-block align-top"
          />{' '}
          <span>{ENVS.app.name}</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {auth.isAuthenticated === false && (
          <Nav>
            <Nav.Link href="/">Login</Nav.Link>
          </Nav>
        )}

        {auth.name && auth.isAuthenticated && (
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            {auth.hassenotypeEdit && (
              <Nav>
                <Nav.Link href={`/senotype/create`}>
                  Register Senotype
                </Nav.Link>
              </Nav>
            )}
            <Nav>
              {/* <Nav.Link href="#home">Home</Nav.Link> */}
              <NavDropdown title={auth.name} id="basic-nav-dropdown">
                <NavDropdown.Item href="#">
                  <ClipboardCopy tag="span" text={auth.groups_token} title="Copy Globus Token">
                    Copy Globus Token
                  </ClipboardCopy>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/logout">Log out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
}

export default AppNavBar;
