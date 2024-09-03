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
const SellerTypeModal = ({
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
      reference: data.reference,
      name: data.name,
      track_inventory: data.track_inventory,
      status: data.status,
      id: data.id
    },

    validationSchema: Yup.object({
      //  email: Yup.string().email('Invalid email.').required('Please Enter Your Email'),
      name: Yup.string().required('Seller Type is Required'),
      reference: Yup.string().required('Reference is Required')
    }),
    onSubmit: (values) => {
      onClickCreate(values);
    }
  });

  const handleSwitchTI = (e) => {
    handleChangeValue({ ...data, track_inventory: e.target.checked ? 1 : 0 });
  };

  const handleSwitchStatus = (e) => {
    handleChangeValue({ ...data, status: e.target.checked ? 1 : 0 });
  };

  return (
    <Modal isOpen={show} centered={true}>
      <div className=" g-1  p-2 flex row modal-headeras">
        <h6 className=" g-1  p-2 flex row modal-title bg-light p-2 flex justify space-between row g-1 modal-header">
          {alert.isEdit === true
            ? 'Update a Seller Typer'
            : 'Add New Seller Type'}
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
                  Seller Type
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
                <label htmlFor="reference" className="form-label">
                  Reference
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="reference"
                  name="reference"
                  onChange={(e) =>
                    handleChangeValue({ ...data, reference: e.target.value })
                  }
                  value={data.reference || ''}
                  invalid={
                    validation.touched.reference && validation.errors.reference
                      ? true
                      : false
                  }
                />
                {validation.touched.reference ? (
                  <FormFeedback type="invalid">
                    {validation.errors.reference}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
            <Col xxl={1}> </Col>
            <Col xxl={1}> </Col>
            <Col xxl={5}>
              <div className="mt-2">
                <Switch
                  title="Track Inventory"
                  onChange={handleSwitchTI}
                  checked={data.track_inventory}
                />
              </div>
            </Col>
            <Col xxl={3}> </Col>
            <Col xxl={1}>
              <div className="mt-2" style={{ marginLeft: '-9px' }}>
                <Switch
                  title="Status"
                  onChange={handleSwitchStatus}
                  checked={!!data.status}
                />
              </div>
            </Col>

            <div className="col-lg-12">
              <div className="hstack gap-2 justify-content-end">
                {data.name.length > 0 || data.reference.length > 0 ? (
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

SellerTypeModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
};

export default SellerTypeModal;
