import { Fragment } from 'react';
import { Tooltip } from 'antd';
import { InputGroup, Form } from 'react-bootstrap';
import log from 'xac-loglevel'

function FormInputGroup({
  id,
  label,
  labelTooltip,
  reducer,
  onChange,
  className = '',
  required = false,
  inputs = [],
}) {
  const getId = ({ id, label }) => id || label.toCamelCase();
  const _id = getId({id, label})

  const handleChange = () => {
    const value = {}
    let _v
    inputs.map((io) => {
      _v = document.querySelector(
        `#c-formInputGroup--${_id} [name="${getId(io)}"]`,
      ).value;
      value[getId(io)] = io.formatter ? io.formatter(_v) : _v
    })
    log.debug('FormInputGroup.handleChange', value);
    onChange({value, field: _id, inputs})
  }

  return (
    <Form.Group
      key={_id}
      id={`c-formInputGroup--${_id}`}
      className={`c-formInputGroup ${className} mt-4`}
    >
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
          <Fragment key={getId(io)}>
            <InputGroup.Text id={getId(io)}>{io.label}</InputGroup.Text>
            <Form.Control
              name={getId(io)}
              onChange={handleChange}
              aria-label="Small"
              aria-describedby={getId(io)}
              value={
                reducer?.state && reducer?.state[_id] && reducer?.state[_id][io.id]
                  ? reducer?.state[_id][io.id]
                  : ''
              }
              {...io.controlProps}
            />
          </Fragment>
        ))}
      </InputGroup>
    </Form.Group>
  );
}

export default FormInputGroup;
