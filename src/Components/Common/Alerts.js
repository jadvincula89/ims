import React from 'react';
import { UncontrolledAlert as Alert } from 'reactstrap';

const Alerts = ({ dismissable = true, ...props }) => {
  return (
    <Alert
      {...props}
      className="border-0 border-0 mb-xl-0"
      closeClassName={!dismissable ? 'visually-hidden' : ''}
      color={props.color}
      fade
    >
      <i className={'align-bottom me-1 ' + props.icon}></i> {props.msg}
    </Alert>
  );
};

export default Alerts;
