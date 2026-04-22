import {useState} from 'react';
import { Flex, Radio, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
import { Form } from 'react-bootstrap';
import log from 'xac-loglevel'
import SelectField from './SelectField';

function MarkerFormInputs({
  predicate,
  getOptions,
  getSearchBehavior,
  senotype,
}) {
  const onChangeDataFile = (file) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContents = e.target.result;
      };

      reader.onerror = (e) => {
        log.error('MarkerForm.onChangeDataFile', e);
      };

      reader.readAsText(file);
    }
  };
  const uploadProps = {
    name: 'file',
    beforeUpload: (file) => {
      const isLt4M = file.size / 1024 / 1024 < 4;
      return isLt4M;
    },
    onChange(info) {
      onChangeDataFile(info.file);
    },
    onDrop(e) {
      onChangeDataFile(e.dataTransfer.files[0]);
    },
  };

  return (
    <div className="c-markerForm">
      <Flex vertical gap={0}>
        <Form.Label htmlFor={'marker-type'}>
          <strong>Marker type</strong>
        </Form.Label>
        <Radio.Group defaultValue="gene" buttonStyle="solid" id="marker-type">
          <Radio.Button value="gene">Gene</Radio.Button>
          <Radio.Button value="protein">Protein</Radio.Button>
        </Radio.Group>
        {predicate.fields && (
          <div className="mt-4">
            <Form.Label htmlFor={'action'}>
              <strong>Action</strong>
            </Form.Label>
            <div>
              <Radio.Group
                defaultValue={predicate.fields[0]}
                buttonStyle="solid"
                id="action"
              >
                {predicate.fields.map((p, index) => (
                  <Radio.Button key={`radio-${index}`} value={p}>{p}</Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
        )}
        <SelectField
          p={predicate}
          getOptions={getOptions}
          getSearchBehavior={getSearchBehavior}
          senotype={senotype}
        />
      </Flex>

      <div className="mt-4">
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload.
          </p>
        </Dragger>
      </div>
    </div>
  );
}

export default MarkerFormInputs;
