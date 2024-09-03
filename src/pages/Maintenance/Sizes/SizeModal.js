import PropTypes from 'prop-types';
import React from 'react';
import Switch from '../../../Components/Common/Switch';
import Alerts from '../../../Components/Common/Alerts';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Col,
  Input,
  Form,
  Label,
  FormFeedback
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
const SizeModal = ({
  show,
  alert,
  data,
  status,
  handleChangeValue,
  onCloseClick,
  onClickCreate
}) => {
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      symbol: data.symbol,
      name: data.name,
      status: data.status,
      id: data.id
    },

    validationSchema: Yup.object({
      //  email: Yup.string().email('Invalid email.').required('Please Enter Your Email'),
      name: Yup.string().required('Size Field is Required'),
      symbol: Yup.string().required('Symbol Field is Required')
    }),
    onSubmit: (values) => {
      onClickCreate(values);
    }
  });

  const handleSwitch = (e) => {
    handleChangeValue({ ...data, status: e.target.checked ? 1 : 0 });
  };

  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <div className=" g-1  p-2 flex row modal-headeras">
        <h6 className=" g-1  p-2 flex row modal-title bg-light p-2 flex justify space-between row g-1 modal-header">
          {alert.isEdit === true ? 'Update Existing Size' : 'Add New Size'}
          <button
            type="button"
            className="btn-close"
            onClick={onCloseClick}
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            {' '}
          </button>
        </h6>
      </div>

      <div style={{ padding: '0.8rem' }}>
        {alert.failure === true ? (
          <Alerts
            msg={alert.message}
            color="danger"
            icon="ri-error-warning-line"
          />
        ) : null}
        <form
          className="needs-validation"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="row g-3">
            <Col xxl={1}> </Col>
            <Col xxl={10}>
              <div>
                <label htmlFor="sizename" className="form-label">
                  Size Name
                </label>
                <Input
                  type="text"
                  className="form-control"
                  name="name"
                  id="sizename"
                  onChange={(e) =>
                    handleChangeValue({ ...data, name: e.target.value })
                  }
                  value={data.name || ''}
                  invalid={
                    validation.touched.name && validation.errors.name
                      ? true
                      : false
                  }
                />

                {validation.touched.name ? (
                  <FormFeedback type="invalid">
                    {validation.errors.name}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
            <Col xxl={1}> </Col>

            <Col xxl={1}> </Col>
            <Col xxl={10}>
              <div>
                <label htmlFor="symbol" className="form-label">
                  Symbol
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="symbol"
                  name="symbol"
                  onChange={(e) =>
                    handleChangeValue({ ...data, symbol: e.target.value })
                  }
                  value={data.symbol || ''}
                  invalid={
                    validation.touched.symbol && validation.errors.symbol
                      ? true
                      : false
                  }
                />
                {validation.touched.symbol ? (
                  <FormFeedback type="invalid">
                    {validation.errors.symbol}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
            <Col xxl={1}> </Col>
            <Col xxl={1}> </Col>
            <Col xxl={10}>
              <div>
                <Switch
                  title="Status"
                  onChange={handleSwitch}
                  checked={!!data.status}
                />
              </div>
            </Col>
            <Col xxl={1}> </Col>
            <div className="col-lg-12">
              <div className="hstack gap-2 justify-content-end">
                {data.name.length > 0 || data.symbol.length > 0 ? (
                  <Button color="primary" type="submit">
                    Save
                  </Button>
                ) : (
                  <Button color="light" type="button">
                    Save
                  </Button>
                )}
                <Button color="light" onClick={onCloseClick}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

SizeModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
};

export default SizeModal;
