import React, { useEffect, useState, useContext, useRef } from 'react';
import { Tree, Skeleton } from 'antd';
import useLocalAPI from '@/hooks/useLocalAPI';
import { InputGroup, Form } from 'react-bootstrap';
import ENVS from '@/lib/envs';
const { DirectoryTree } = Tree;
import log from 'xac-loglevel';
import EditContext from '@/context/EditContext';

const EditorLibrary = () => {
  const { results, loading } = useLocalAPI({ values: [] });
  const [libraryData, setLibraryData] = useState(null);
  const { setSenotype } = useContext(EditContext);
  const senotypeDict = useRef({});

  useEffect(() => {
    if (results && Array.isArray(results.results)) {
      let res = [];
      for (const r of results.results) {
        senotypeDict.current[r.senotypeid] = r;
        res.push({
          title: r.senotypejson.senotype.name,
          key: `${r.senotypeid}-parent`,
          children: [
            {
              title: `Version 1 ${r.senotypeid}`,
              key: r.senotypeid,
              isLeaf: true,
            },
          ],
        });
      }
      setLibraryData(res);
    }
  }, [results]);

  const onSelect = (keys, info) => {
    log.debug('Trigger Select', keys, info);
    if (keys.length === 1) {
      setSenotype(senotypeDict.current[keys[0]]);
    }
  };
  const onExpand = (keys, info) => {
    log.debug('Trigger Expand', keys, info);
  };
  return (
    <div className="p-2" style={{ maxHeight: 500, overflowY: 'auto' }}>
      <h2 className="h4 mx-3 mb-3">{ENVS.app.name} Library</h2>
      <InputGroup className="mb-3">
        <Form.Control
          aria-label="Search"
          aria-describedby="inputGroup-sizing-sm"
        />
        <InputGroup.Text id="inputGroup-sizing-sm">Search</InputGroup.Text>
      </InputGroup>
      {loading && <Skeleton />}
      {libraryData && (
        <DirectoryTree
          multiple
          draggable={false}
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={libraryData}
        />
      )}
    </div>
  );
};
export default EditorLibrary;
