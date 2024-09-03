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
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  ButtonGroup,
  DropdownItem,
  DropdownMenu
} from 'reactstrap';

import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import * as Yup from 'yup';
import { useFormik } from 'formik';

const CategoryModal = ({
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

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: data.name,
      status: data.status,
      id: data.id,
      reference: data.reference,
      subcategory: data.subcategory
    },

    validationSchema: Yup.object({
      //  email: Yup.string().email('Invalid email.').required('Please Enter Your Email'),
      name: Yup.string().required('Category already exist')
    }),
    onSubmit: (values) => {
      onClickCreate(values);
    }
  });
  const handleSubCategory = (newValue) => {
    handleChangeValue({ ...data, subcategory: newValue });
  };
  const handleSwitch = (e) => {
    handleChangeValue({ ...data, status: e.target.checked ? 1 : 0 });
  };

  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <div className=" g-1  p-2 flex row modal-headeras">
        <h6 className=" g-1  p-2 flex row modal-title bg-light p-1 flex justify space-between row g-1 modal-header">
          {alert.isEdit === true
            ? 'Update Existing Category'
            : 'Add New Category'}
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
        <form
          className="needs-validation"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="row">
            <Col xxl={6}>
              <div className="row g-1 mb-3">
                <Col xxl={12}>
                  <div>
                    <label htmlFor="categoryname" className="form-label">
                      Category Name
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="name"
                      id="categoryname"
                      onChange={(e) =>
                        handleChangeValue({ ...data, name: e.target.value })
                      }
                      value={data.name || ''}
                      invalid={
                        (validation.touched.name && validation.errors.name) ||
                        alert.failure === true
                          ? true
                          : false
                      }
                    />

                    {validation.touched.name || alert.failure === true ? (
                      <FormFeedback type="invalid">
                        {alert.message}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
              </div>

              <div className="row g-3">
                <Col xxl={12}>
                  <div className="mb-3">
                    <Label
                      htmlFor="choices-publish-status-input"
                      className="form-label"
                    >
                      Sub Categories
                    </Label>
                    <CreatableSelect
                      isMulti
                      name="subcategory"
                      value={data.subcategory || ''}
                      onChange={(newValue) => handleSubCategory(newValue)}
                    />
                  </div>
                </Col>
              </div>
              <div className="row g-3">
                <Col xxl={12}>
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
              <div className="row g-1 mt-2">
                <Col xxl={12}>
                  <div>
                    <label htmlFor="reference" className="form-label">
                      Reference
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="reference"
                      id="reference"
                      onChange={(e) =>
                        handleChangeValue({
                          ...data,
                          reference: e.target.value
                        })
                      }
                      value={data.reference || ''}
                      invalid={
                        (validation.touched.reference &&
                          validation.errors.reference) ||
                        alert.failure === true
                          ? true
                          : false
                      }
                    />

                    {validation.touched.reference || alert.failure === true ? (
                      <FormFeedback type="invalid">
                        {alert.message}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
              </div>
            </Col>
            <Col xxl={6}>
              <p className="fw-medium">Selected available sizes</p>
              <SimpleBar style={{ maxHeight: '200px' }} className="pe-2">
                <Container fluid>
                  {alert.isEdit === true &&
                    data.selected_sizes.map((s) => (
                      <div
                        key={s.id}
                        className="form-check form-check form-check-primary mb-3"
                      >
                        <div key={s}>
                          {s.selected === false ? (
                            <Input
                              className="form-check-input"
                              value={s.id}
                              onChange={handleCheckboxChange}
                              type="checkbox"
                              id={'checkbox_' + s.id}
                            />
                          ) : (
                            <Input
                              className="form-check-input"
                              value={s.id}
                              onChange={handleCheckboxChange}
                              type="checkbox"
                              id={'checkbox_' + s.id}
                              defaultChecked
                            />
                          )}
                        </div>

                        <Label
                          className="form-check-label"
                          for={'checkbox_' + s.id}
                        >
                          {s.symbol}
                        </Label>
                      </div>
                    ))}

                  {alert.isEdit === false &&
                    sizes.map((s) => (
                      <div
                        key={s.id}
                        className="form-check form-check form-check-primary mb-3"
                      >
                        <Input
                          className="form-check-input"
                          value={s.id}
                          onChange={handleCheckboxChange}
                          type="checkbox"
                          id={'checkbox_' + s.id}
                        />
                        <Label
                          className="form-check-label"
                          for={'checkbox_' + s.id}
                        >
                          {s.symbol}
                        </Label>
                      </div>
                    ))}
                </Container>
              </SimpleBar>
            </Col>
          </div>
          <div className="col-lg-12">
            <div className="hstack gap-2 justify-content-end">
              {data.name.length > 0 ? (
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
        </form>
      </div>
    </Modal>
  );
};

CategoryModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
};

export default React.memo(CategoryModal);
