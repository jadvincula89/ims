import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Badge } from 'reactstrap';
import { Input, Label } from 'reactstrap';
const SizeBadge = ({ sizes }) => {
  return (
    <React.Fragment>
      <div className="hstack gap-1">
        {sizes
          .filter((s) => s.selected === true)
          .map((item) => (
            <Badge key={item.id} color="primary">
              {' '}
              {item.symbol}{' '}
            </Badge>
          ))}{' '}
      </div>
    </React.Fragment>
  );
};

export default SizeBadge;
