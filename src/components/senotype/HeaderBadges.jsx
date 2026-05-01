import { Skeleton } from 'antd';
import { ubkgPredicates } from '@/config/search/senotype';
import URLS from '@/lib/urls';
import { organHierarchy } from '@/lib/general';
import PREDICATE from '@/lib/predicate';
import React, { useContext } from 'react';
import AppContext from '@/context/AppContext';

function HeaderBadges({ data }) {
  const { auth } = useContext(AppContext);
  const {isCellType, isHallmark, isOrgan} = PREDICATE;

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
    let term;

    for (const p of ubkgPredicates) {
      // TODO update fields
      // skip cell types and hallmark  since the terms can be long, which won't output neat badges
      if (!isCellType(p.field) && !isHallmark(p.field)) {
        for (const v of data[p.field] || []) {
          term = organHierarchy(v.term);

          if (!added[term]) {
            // Don't want to add any multiple times
            added[term] = true;
            list.push(badge({ v, p, term, isOrgan: isOrgan(p.field) }));
          }
        }
      }
    }

    return list;
  };
  if (!data) {
    return <Skeleton.Node />;
  }
  return <div className="c-headerBadges">{getBadges()}</div>;
}

export default HeaderBadges;
