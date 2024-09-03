import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Switch from '../../../Components/Common/Switch';

import SimpleBar from 'simplebar-react';
import {
  Modal,
  ModalBody,
  ButtonGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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

const Filter = ({
  data,
  shownoCategory,
  brand,
  category,
  setnoCat,
  handleCheckboxChange,
  onClickFilter,
  updateCategories,
  updateBrands,
  checkAll
}) => {
  const [checkboxes, setCheckBoxes] = useState(false);

  const onSelectAll = async () => {
    setCheckBoxes(true);
    checkAll(true);
    updateBrands(undefined);
    updateCategories(undefined);
    const modifiedBrand = await brand?.map((item) => ({
      ...item,
      checked: true
    }));
    updateBrands(modifiedBrand);
    const modifiedCat = await category?.map((item) => ({
      ...item,
      checked: true
    }));
    updateCategories(modifiedCat);
  };

  const onUnSelectAll = async () => {
    setCheckBoxes(false);
    updateBrands(undefined);
    updateCategories(undefined);
    const modifiedBrand = await brand?.map((item) => ({
      ...item,
      checked: false
    }));
    updateBrands(modifiedBrand);
    const modifiedCat = await category?.map((item) => ({
      ...item,
      checked: false
    }));

    updateCategories(modifiedCat);
    checkAll(false);
  };
  const noCategory = async (e) => {
    const isChecked = e.target.checked;
    setnoCat(isChecked);
  };
  const preCheck = async (e) => {
    handleCheckboxChange(e);
    setCheckBoxes(false);
    const isChecked = e.target.checked;
    const id = e.target.id.split('_');

    if (id[0] === 'brand') {
      const status = isChecked;

      const updatedItems = brand.map((item) => {
        if (item.id === parseInt(id[1])) {
          return { ...item, checked: status };
        }
        return item;
      });

      updateBrands(updatedItems);
    }
    if (id[0] === 'category') {
      const status = isChecked;

      const updatedItems = category.map((item) => {
        if (item.id === parseInt(id[1])) {
          // If the item has the given ID, update its properties
          return { ...item, checked: status };
        }
        return item; // For other items, return unchanged
      });

      updateCategories(updatedItems);
    }
  };

  return (
    <div>
      <ButtonGroup>
        <UncontrolledDropdown>
          <DropdownToggle tag="button" className="btn btn-primary">
            <i className="ri-filter-fill me-1 align-bottom"></i>
            Filter{' '}
          </DropdownToggle>
          <DropdownMenu
            style={{ width: 'auto', minWidth: '250px' }}
            className="dropdown-menu-end"
            container="body"
          >
            <div className="row">
              <div className="">
                <Button
                  color="secondary"
                  size="sm ms-3 me-5 mt-1"
                  type="button"
                  onClick={onSelectAll}
                >
                  Select All
                </Button>

                <Button
                  color="secondary"
                  size="sm ms-5 mt-1"
                  onClick={onUnSelectAll}
                  type="button"
                >
                  Clear
                </Button>
              </div>
            </div>
            <DropdownItem disabled>Category</DropdownItem>
            <SimpleBar style={{ maxHeight: '150px' }} className="pe-2">
              <Container fluid>
                <div key={0}>
                  <div key={0} className="mb-1">
                    <input
                      className="form-check-input"
                      value={0}
                      type="checkbox"
                      name="category"
                      onChange={noCategory}
                      defaultChecked={shownoCategory}
                      id={'category_' + 0}
                    />

                    <Label
                      className="form-check-label ms-1"
                      for={'category_' + 0}
                    >
                      {'No Category'}
                    </Label>
                  </div>
                </div>
                {category &&
                  category.map((s) => (
                    <div key={s.id}>
                      <div key={s.id} className="mb-1">
                        <input
                          className="form-check-input"
                          value={s.id}
                          type="checkbox"
                          name="category"
                          defaultChecked={checkboxes || s.checked}
                          onChange={preCheck}
                          id={'category_' + s.id}
                        />

                        <Label
                          className="form-check-label ms-1"
                          for={'category_' + s.id}
                        >
                          {s.name}
                        </Label>
                      </div>
                    </div>
                  ))}
              </Container>
            </SimpleBar>

            <DropdownItem disabled>Brand</DropdownItem>
            <SimpleBar style={{ maxHeight: '200px' }} className="pe-2">
              <Container fluid>
                {brand &&
                  brand.map((s) => (
                    <div key={s.id}>
                      <div key={s.id} className="mb-1">
                        <Input
                          className="form-check-input"
                          value={s.id}
                          type="checkbox"
                          name="product_type"
                          defaultChecked={checkboxes || s.checked}
                          onChange={preCheck}
                          id={'brand_' + s.id}
                        />

                        <Label
                          className="form-check-label ms-1"
                          for={'brand_' + s.id}
                        >
                          {s.name}
                        </Label>
                      </div>
                    </div>
                  ))}
              </Container>
            </SimpleBar>
            <DropdownItem divider />

            <div className="row">
              <div className="col-sm-12">
                <Button
                  color="primary"
                  className="filter-button"
                  size="sm"
                  type="button"
                  onClick={onClickFilter}
                >
                  Filter
                </Button>
              </div>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </ButtonGroup>
    </div>
  );
};

Filter.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
};

export default React.memo(Filter);
