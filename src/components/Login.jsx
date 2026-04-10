'use client';
import React, { useEffect, useContext } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import AppContext from '@/context/AppContext';
import ENVS from '@/lib/envs';
import URLS from '@/lib/urls';

function Login() {
  const { isAuthorized } = useContext(AppContext);

  useEffect(() => {
    if (isAuthorized) {
    }
  });

  return (
    <div>
      <Row className={'mt-resp'} style={{ minHeight: '530px' }}>
        <Col></Col>
        <Col xs={10} lg={6}>
          <div className={`card alert alert-info mt-4`}>
            <div className="card-body">
              <h3 className="card-title">{ENVS.app.name}</h3>
              <div className="card-text">
                User authentication is required to search the dataset catalog.
                Please click the button below and you will be redirected to a
                Globus page to select your institution. After selecting your
                institution, you will be redirected to your institutional login
                page to enter your credentials.
              </div>
              <hr />
              <div className={'d-flex justify-content-center'}>
                <a
                  className="btn btn-outline-success rounded-0 btn-lg js-btn--login"
                  href={URLS.login}
                >
                  Log in with your institution credentials
                </a>
              </div>
            </div>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
}

export default Login;
