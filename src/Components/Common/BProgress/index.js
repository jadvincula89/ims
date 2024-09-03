import React from 'react';
import { Progress } from 'reactstrap';

const BProgress = (props) => {
  return (
    <Progress animated bar color="success" value="50">
      50/100
    </Progress>
  );
};

export default BProgress;
