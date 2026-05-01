import { Button, Skeleton, Space, Tooltip } from 'antd';
import React, { useContext } from 'react';
import AppContext from '@/context/AppContext';
import { Col, Row } from 'react-bootstrap';
import { FileOutlined } from '@ant-design/icons';
import HeaderBadges from '@/components/senotype/HeaderBadges';

function ViewSenotypeHeader({ data }) {
  const { auth } = useContext(AppContext);

  if (!data) {
    return <Skeleton.Node />;
  }
  return (
    <Row className="c-viewSenotypeHeader">
      <Col md={8} sm={12} className={'mb-2'}>
        <HeaderBadges data={data} />
      </Col>
      <Col md={4} sm={12}>
        <Space align="center" className="float-md-end">
          {auth.isAuthenticated && auth.hasSenotypeEdit && (
            <Button
              disabled={
                (!auth.isSameUser(data?.created_by_user_sub))
              }
              href={`/senotype/edit/${data.uuid}`}
            >
              Edit
            </Button>
          )}
          <Tooltip title={'View JSON'}>
            <Button href={`/api/json/senotype/${data.uuid}`}>
              <FileOutlined />
            </Button>
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );
}

export default ViewSenotypeHeader;
