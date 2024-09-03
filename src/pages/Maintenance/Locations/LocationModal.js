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
const LocationModal = ({
  show,
  alert,
  data,
  options,

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
      id: data.id,
      building: data.building,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      reference: data.reference,
      pos_id: data.pos_id
    },

    validationSchema: Yup.object({
      //   email: Yup.string().email('Invalid email.').required('Please Enter Your Email'),
      name: Yup.string().required('Location Field is Required'),
      symbol: Yup.string().required('Symbol Field is Required'),
      building: Yup.string().required('Building Field is Required'),
      street: Yup.string().required('Street Field is Required'),
      city: Yup.string().required('City Field is Required'),
      state: Yup.string().required('State Field is Required'),
      country: Yup.string().required('Country Field is Required')
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
          {alert.isEdit === true
            ? 'Update Existing Store Location'
            : 'New Store Location'}
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
        {/* {alert.failure === true ? (
          <Alerts
            msg={<div>
            
                <ul key={1}>
                  {alert.error[0]?.name && <li key={2}>
                  <strong>{alert.error[0].name}</strong>

                </li>}
                 {alert.error[0]?.state_abbr &&<li key={3}>
                 <strong>{alert.error[0].state_abbr}</strong>

               </li>} </ul>
              
               
            </div>}
            color="danger"
            icon="ri-error-warning-line"
          />
        ) : null} */}
        <form
          className="needs-validation"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="row g-3">
            <Col xxl={12} lg={12}>
              <div>
                <label htmlFor="name" className="form-label">
                  Location
                </label>
                <Input
                  type="text"
                  className="form-control"
                  name="name"
                  id="name"
                  onChange={(e) =>
                    handleChangeValue({ ...data, name: e.target.value })
                  }
                  value={data.name || ''}
                  invalid={
                    (validation.touched.name && validation.errors.name) ||
                    alert.name !== ''
                      ? true
                      : false
                  }
                />

                {validation.touched.name ? (
                  <FormFeedback type="invalid">
                    {validation.errors.name}
                  </FormFeedback>
                ) : null}
                {alert.failure === true && alert.name !== '' && (
                  <FormFeedback type="invalid">{alert.name}</FormFeedback>
                )}
              </div>
            </Col>

            <Col xxl={12} lg={12}>
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
                    (validation.touched.symbol && validation.errors.symbol) ||
                    alert.symbol !== ''
                      ? true
                      : false
                  }
                />
                {validation.touched.symbol ? (
                  <FormFeedback type="invalid">
                    {validation.errors.symbol}
                  </FormFeedback>
                ) : null}
                {alert.failure === true && (alert.symbol !== '') !== '' && (
                  <FormFeedback type="invalid">{alert.symbol}</FormFeedback>
                )}
              </div>
            </Col>
            <Col xxl={12} lg={12}>
              <div>
                <label htmlFor="building" className="form-label">
                  Bldg.
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="building"
                  name="building"
                  onChange={(e) =>
                    handleChangeValue({ ...data, building: e.target.value })
                  }
                  value={data.building || ''}
                  invalid={
                    validation.touched.building && validation.errors.building
                      ? true
                      : false
                  }
                />
                {validation.touched.building ? (
                  <FormFeedback type="invalid">
                    {validation.errors.building}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
            <Col xxl={12} lg={12}>
              <div>
                <label htmlFor="street" className="form-label">
                  Street
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="street"
                  name="street"
                  onChange={(e) =>
                    handleChangeValue({ ...data, street: e.target.value })
                  }
                  value={data.street || ''}
                  invalid={
                    validation.touched.street && validation.errors.street
                      ? true
                      : false
                  }
                />
                {validation.touched.street ? (
                  <FormFeedback type="invalid">
                    {validation.errors.street}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
            <Col xxl={12} lg={12}>
              <div>
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  onChange={(e) =>
                    handleChangeValue({ ...data, city: e.target.value })
                  }
                  value={data.city || ''}
                  invalid={
                    validation.touched.city && validation.errors.city
                      ? true
                      : false
                  }
                />
                {validation.touched.city ? (
                  <FormFeedback type="invalid">
                    {validation.errors.city}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
            <Col xxl={12} lg={12}>
              <div>
                <label htmlFor="state" className="form-label">
                  State
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="state"
                  name="state"
                  onChange={(e) =>
                    handleChangeValue({ ...data, state: e.target.value })
                  }
                  value={data.state || ''}
                  invalid={
                    validation.touched.state && validation.errors.state
                      ? true
                      : false
                  }
                />
                {validation.touched.state ? (
                  <FormFeedback type="invalid">
                    {validation.errors.state}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
            <Col xxl={12} lg={12}>
              <div>
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  onChange={(e) =>
                    handleChangeValue({ ...data, country: e.target.value })
                  }
                  value={data.country || ''}
                  invalid={
                    validation.touched.country && validation.errors.country
                      ? true
                      : false
                  }
                />
                {validation.touched.country ? (
                  <FormFeedback type="invalid">
                    {validation.errors.country}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
            <Col xxl={12} lg={12}>
              <div>
                <label htmlFor="country" className="form-label">
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
            <Col xxl={12} lg={12}>
              <div>
                <label htmlFor="pos_id" className="form-label">
                  POS ID
                </label>
                <select
                  className="form-select mb-1"
                  name="pos_id"
                  id="pos_id"
                  onChange={(e) =>
                    handleChangeValue({ ...data, pos_id: e.target.value })
                  }
                >
                  {alert.isEdit === true ? (
                    <option key={data.pos_id} defaultValue={data.pos_id}>
                      {data.pos_id}
                    </option>
                  ) : (
                    <option value={'----'}>Select POS ID </option>
                  )}

                  {alert.isEdit === true &&
                    options
                      .filter((items) => items !== data.pos_id)
                      .map((item) => (
                        <option key={item} defaultValue={item}>
                          {item}
                        </option>
                      ))}
                  {alert.isEdit === false &&
                    options.map((item) => (
                      <option key={item} defaultValue={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            </Col>
            <Col xxl={12}>
              <div>
                <Switch
                  title="Status"
                  onChange={handleSwitch}
                  checked={data.status}
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

LocationModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
};

export default LocationModal;
