import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import CountUp from 'react-countup';

const Counter = (props) => {
  const item = {
    id: 1,
    label: 'Inventory Count',
    counter: '100',
    badge: 'ri-arrow-up-line',
    badgeClass: 'success',
    percentage: '17.32 %',
    icon: 'ri-ticket-2-line',
    iconClass: 'info',
    decimals: 1,
    prefix: '',
    suffix: 'k'
  };
  return (
    <div className={`header-item p-0 ms-sm-1 text-info bg-soft-${props.color}`}>
      <div className="d-flex">
        <div className="d-flex">
          <div className="avatar-sm flex-shrink-0 h-100">
            <span
              className={
                'avatar-title fs-3 bg-soft-' +
                props.color +
                ' text-' +
                props.color
              }
            >
              <i className={props.icon || item.icon}></i>
            </span>
          </div>
        </div>
        <div className="text-center p-2 d-flex flex-column justify-content-center ">
          <h6 className="m-0">
            <span className="counter-value">
              <CountUp
                start={0}
                end={props.counter}
                duration={1}
                separator=","
              />
            </span>
          </h6>
          <span className="mb-0 text-muted">{props.label}</span>
        </div>
      </div>
    </div>
  );
};

export default Counter;
