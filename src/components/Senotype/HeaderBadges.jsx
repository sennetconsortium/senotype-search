import { Button, Skeleton, Space, Tooltip } from 'antd';
import { ubkgPredicates } from '@/config/search/senotype';
import URLS from '@/lib/urls';
import { organHierarchy } from '@/lib/general';
import React, { useContext } from 'react';
import AppContext from '@/context/AppContext';
import { Col, Row } from 'react-bootstrap';
import { FileOutlined } from '@ant-design/icons';

function HeaderBadges({ data }) {
  const { auth } = useContext(AppContext);

  const badge = ({ v, p, term, isOrgan }) => {
    return (
      <span key={v.term} className={`badge badge--${p.field}`}>
        {term}{' '}
        {isOrgan ? (
          <img
            src={URLS.organIcon(term)}
            className="w-fixed"
            width={16}
            height={16}
            alt={v.code}
          />
        ) : (
          ''
        )}
      </span>
    );
  };
  const getBadges = () => {
    const list = [];
    const added = {};
    let isOrgan = false;
    let term;

    for (const p of ubkgPredicates) {
      // skip cell types since the terms can be long, which won't output neat badges
      if (p.field !== 'has_cell_type') {
        for (const v of data[p.field] || []) {
          isOrgan = p.field === 'located_in';
          term = organHierarchy(v.term);

          if (!added[term]) {
            // Don't want to add any multiple times
            added[term] = true;
            list.push(badge({ v, p, term, isOrgan }));
          }
        }
      }
    }

    return list;
  };
  if (!data) {
    return <Skeleton.Node />;
  }
  return (
    <Row>
      <Col md={8} sm={12} className={'mb-2'}>
        <div className="c-headerBadges">{getBadges()}</div>
      </Col>
      <Col md={4} sm={12}>
        <Space align="center" className="float-md-end">
          {auth.isAuthenticated && auth.hassenotypeEdit && (
            <Button href={`${URLS.senotypeEditor}edit/${data.sennet_id}`}>
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

export default HeaderBadges;
