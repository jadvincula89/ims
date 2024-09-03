import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Switch from '../../../Components/Common/Switch';

import SimpleBar from 'simplebar-react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Col,
  Input,
  Form,
  Label,
  FormFeedback,
  Container
} from 'reactstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import BModal from '../../../Components/Common/Modal';

const ConditionModal = ({
  show,
  alert,
  data,
  sizes,
  handleChangeValue,
  handleCheckboxChange,
  onCloseClick,
  onClickCreate
}) => {
  const [status, setStatus] = useState(null);
  const [options, setOptions] = useState([]);

  const [value, setValue] = useState([{ label: 'jason', value: 'jason' }]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: data.name,
      status: data.status,
      id: data.id,
      tags: data.tags,
      symbol: data.symbol,
      reference: data.reference
    },

    validationSchema: Yup.object({
      //  email: Yup.string().email('Invalid email.').required('Please Enter Your Email'),
      name: Yup.string().required('Please Enter Condition Name'),
      symbol: Yup.string().required('Please Enter Condition Symbol')
      // tags: Yup.string().required('Please Enter Condition Tags')
    }),
    onSubmit: (values) => {
      onClickCreate(values);
    }
  });
  const handleTag = (newValue) => {
    setValue(newValue);

    handleChangeValue({ ...data, tags: newValue });
  };
  const handleSwitch = (e) => {
    handleChangeValue({ ...data, status: e.target.checked ? 1 : 0 });
  };

  return (
    <BModal
      show={show}
      onCloseClick={onCloseClick}
      centered
      title={!!alert.isEdit ? 'Update Existing Condition' : 'New Condition'}
    >
      <form
        className="needs-validation"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <div className="row">
          <div className="row g-1 mb-1">
            <Col xxl={1} />
            <Col xxl={10}>
              <div>
                <label htmlFor="categoryname" className="form-label">
                  Condition Name
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
          </div>
          <div className="row g-1 mb-1">
            <Col xxl={1} />
            <Col xxl={10}>
              <div>
                <label htmlFor="symbol" className="form-label">
                  Symbol
                </label>
                <Input
                  type="text"
                  className="form-control"
                  name="symbol"
                  id="symbol"
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
          </div>
          <div className="row g-1 mb-1">
            <Col xxl={1} />
            <Col xxl={10}>
              <div>
                <label htmlFor="symbol" className="form-label">
                  Reference
                </label>
                <Input
                  type="text"
                  className="form-control"
                  name="reference"
                  id="reference"
                  onChange={(e) =>
                    handleChangeValue({ ...data, reference: e.target.value })
                  }
                  value={data.reference + ''}
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
          </div>
          <div className="row g-1">
            <Col xxl={1} />
            <Col xxl={10}>
              <div className="mb-2">
                <Label
                  htmlFor="choices-publish-status-input"
                  className="form-label"
                >
                  Tags
                </Label>
                <CreatableSelect
                  isMulti
                  id="tags"
                  name="tags"
                  value={data.tags || ''}
                  onChange={(newValue) => handleTag(newValue)}
                />
              </div>
            </Col>
          </div>
          <div className="row g-1">
            <Col xxl={1} />
            <Col xxl={10}>
              <div>
                <div>
                  <Switch
                    title="Status"
                    onChange={handleSwitch}
                    checked={!!data.status}
                  />
                </div>
              </div>
            </Col>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="hstack gap-2 justify-content-end">
            <Button color="primary" type="submit">
              Save
            </Button>

            <Button color="light" onClick={onCloseClick}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </BModal>
  );
};

ConditionModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
};

export default React.memo(ConditionModal);
