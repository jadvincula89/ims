import React from 'react';
import { Modal, Spinner } from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FPLoader = (props) => {
  return (
    <Modal isOpen={!!props.open} centered {...props} size="sm">
      <React.Fragment>
        <div className="d-flex justify-content-center align-items-center  mx-2 p-3">
          <Spinner color="primary" size="lg">
            Loading...
          </Spinner>
        </div>
        <h5 className="ml-2 text-center">
          {' '}
          {props.message ? props.message : 'Loading...'}
        </h5>
      </React.Fragment>
    </Modal>
  );
};

export default FPLoader;
