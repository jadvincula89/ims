import React from 'react';
import { FormFeedback, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';

const BInput = ({
  label,
  type = 'text',
  className,
  error,
  invalid = false,
  name = '',
  ...props
}) => {
  const classes = `form-control ${className || ''}`;
  return (
    <>
      {!!label && (
        <Label className="form-label text-nowrap" htmlFor={name}>
          {label}
        </Label>
      )}
      <Input
        type={type}
        className={classes}
        invalid={!!invalid}
        name={name}
        {...props}
        rows={4}
      >
        {props?.children}
      </Input>
      {!!error && <FormFeedback type="invalid">{error}</FormFeedback>}
    </>
  );
};

BInput.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string || PropTypes.array,
  invalid: PropTypes.bool,
  name: PropTypes.string
};

export default BInput;
