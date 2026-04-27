import React from 'react';
import { Form } from 'react-bootstrap';
import { Select } from 'antd';
import log from 'xac-loglevel'
import { Tooltip } from 'antd';

function InputField({
  id,
  label,
  helpText,
  className = '',
  selectData,
  labelTooltip,
  dropIcon,
  onChange,
  controlProps = {},
}) {
  const _id = id || label.toCamelCase();
  const helpBlockId = `${_id}HelpBlock`;

  const handleChange = (e) => {
    if (onChange) {
      onChange({ e, field: _id });
    }
  };

  return (
    <Form.Group className={`c-inputField ${className} mt-4`}>
      <Form.Label htmlFor={_id}>
        <strong>{label}</strong>
        {controlProps.required && (
          <sup className="form-required-indicator text-danger">*</sup>
        )}
        {labelTooltip && (
          <Tooltip title={labelTooltip}>
            {' '}
            <i className="bi bi-question-circle"></i>
          </Tooltip>
        )}
      </Form.Label>

      {!selectData && (
        <Form.Control
          onChange={(e) => handleChange(e)}
          aria-describedby={helpText ? helpBlockId : undefined}
          {...controlProps}
        />
      )}

      {selectData && (
        <Select
          id={_id}
          suffixIcon={dropIcon || <i className="bi bi-chevron-down"></i>}
          showSearch={{
            optionFilterProp: 'label',
            onSearch: (v) => log.info('InputField.Select', v),
          }}
          onChange={(e) => handleChange(e)}
          style={{ width: '100%' }}
          {...controlProps}
          options={selectData}
        />
      )}

      {helpText && (
        <Form.Text id={helpBlockId} muted>
          {helpText}
        </Form.Text>
      )}
    </Form.Group>
  );
}

export default InputField;
