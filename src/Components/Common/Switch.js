import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { Input, Label } from 'reactstrap';
const Switch = ({ title, checked, className, ...props }) => {
  return (
    <React.Fragment>
      <div className="form-check form-switch">
        <Input
          className={`form-check-input ${className || ''}`}
          type="checkbox"
          role="switch"
          checked={checked}
          {...props}
        />
        <Label className="form-check-label">{title}</Label>
      </div>
    </React.Fragment>
  );
};

export default Switch;
