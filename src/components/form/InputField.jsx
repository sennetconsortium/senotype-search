import React from 'react';
import { Form } from 'react-bootstrap';
import { Select } from 'antd';
import log from 'xac-loglevel'
import { Tooltip } from 'antd';
import THEME from '@/lib/theme';

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

  const handleChange = (data) => {
    log.debug('InputField.handleChange', data);

    let value = []
    if (Array.isArray(data)) {
      value = data.map((d) => d.includes("{") ? JSON.parse(d) : d)
    } else {
      value = data?.includes("{") ? JSON.parse(data) : data
    }
    if (onChange) {
      onChange({ value, field: _id });
    }

    const $io = document.getElementById(`c-inputField--${_id}`)
    const errorList = THEME.getTabPane($io).querySelectorAll(THEME.selectors.invalid);
    if (!errorList.length) {
      THEME.getTabPaneTab($io).classList.remove(THEME.classNames.invalid)
    }
    
  };

  return (
    <Form.Group
      className={`c-inputField ${className} mt-4`}
      id={`c-inputField--${_id}`}
    >
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
          onChange={(e) => handleChange(e.target.value)}
          aria-describedby={helpText ? helpBlockId : undefined}
          {...controlProps}
        />
      )}

      {selectData && (
        <Select
          key={JSON.stringify(selectData) + _id}
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
