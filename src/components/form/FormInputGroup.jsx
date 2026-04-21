import { Fragment } from 'react';
import { Tooltip } from 'antd';
import { InputGroup, Form } from 'react-bootstrap';

function FormInputGroup({
  id,
  label,
  labelTooltip,
  className = '',
  required = false,
  inputs = [],
}) {
  const _id = id || label.toCamelCase();
  return (
    <Form.Group key={_id} className={`c-formInputGroup ${className} mt-4`}>
      <Form.Label htmlFor={_id}>
        <strong>{label}</strong>
        {required && (
          <sup className="form-required-indicator text-danger">*</sup>
        )}
        {labelTooltip && (
          <Tooltip title={labelTooltip}>
            {' '}
            <i className="bi bi-question-circle"></i>
          </Tooltip>
        )}
      </Form.Label>
      <InputGroup size="sm" className="mb-3">
        {inputs.map((io, index) => (
          <Fragment key={io.label}>
            <InputGroup.Text
              key={io.label + index + 'ic'}
              id={io.id || io.label.toCamelCase()}
            >
              {io.label}
            </InputGroup.Text>
            <Form.Control
              key={io.label + index + 'fc'}
              aria-label="Small"
              aria-describedby={io.id || io.label.toCamelCase()}
              {...io.controlProps}
            />
          </Fragment>
        ))}
      </InputGroup>
    </Form.Group>
  );
}

export default FormInputGroup;
