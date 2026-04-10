import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import '@/lib/general';

function InputField({
  id,
  label,
  helpText,
  className,
  selectData,
  controlProps = {},
}) {
  const _id = id || label.toCamelCase();
  const helpBlockId = `${_id}HelpBlock`;
  return (
    <Form.Group className={`${className} mt-4`}>
      <Form.Label htmlFor={_id}>
        {label}
        {controlProps.required && (
          <sup className="form-required-indicator text-danger">*</sup>
        )}
      </Form.Label>

      {!selectData && (
        <Form.Control
          aria-describedby={helpText ? helpBlockId : undefined}
          {...controlProps}
        />
      )}

      {selectData && (
        <Form.Select {...controlProps}>
          {selectData.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </Form.Select>
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
