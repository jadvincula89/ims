import React, { useMemo, useState } from 'react';

import {
  Button,
  ButtonGroup,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Spinner,
  UncontrolledDropdown
} from 'reactstrap';
import Select from 'react-select';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { Link } from 'react-router-dom';
import { useQuantitiesQuery } from '../../../services/product';
import { useCategoryQuery } from '../../../services/category';
import { useProductSizeQuery } from '../../../services/size';
import { useListQuery } from '../../../services/product_type';
import { useLocationListQuery } from '../../../services/location';
import { useConditionsQuery } from '../../../services/condition';
import { useSellertypeQuery } from '../../../services/seller_type';
import { getItemById } from '../../../common/helpers/product';
import BPagination from '../../../Components/Common/BPagination';
import { DEFAULT_PER_PAGE } from '../../../common/constants';
import BTable from '../../../Components/Common/BTable';
import ProductTitle from '../../../Components/Common/ProductTitle';

const Quantities = (props) => {
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [category_id, setCategoryId] = useState('');
  const [type_id, setTypeId] = useState('');
  const [location, setLocation] = useState('');
  const [seller_type, setSellerType] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [keywords, setKeywords] = useState('');
  const { data: category_data } = useCategoryQuery({ per_page: 1000 });
  const { data: size_data } = useProductSizeQuery({ per_page: 1000 });
  const { data: product_type_data } = useListQuery({ per_page: 1000 });
  const { data: location_data } = useLocationListQuery({ per_page: 1000 });
  const { data: condition_data } = useConditionsQuery({ per_page: 1000 });
  const { data: seller_type_data } = useSellertypeQuery({ per_page: 1000 });
  const [params, setParams] = useState({
    category_id: '',
    type_id: '',
    location: '',
    seller_type: '',
    size: '',
    condition: '',
    keywords: ''
  });
  const { data, isLoading, isFetching } = useQuantitiesQuery({
    page,
    per_page,
    ...params
  });

  const category_options = category_data?.data.map((d) => ({
    value: d.id,
    label: d.name
  }));
  const size_options = size_data?.data.map((d) => ({
    value: d.symbol,
    label: d.name
  }));
  const product_type_options = product_type_data?.data.map((d) => ({
    value: d.id,
    label: d.name
  }));
  const location_options = location_data?.data.map((d) => ({
    value: d.id,
    label: d.name
  }));
  const condition_options = condition_data?.data.map((d) => ({
    value: d.id,
    label: d.name
  }));
  const seller_type_options = seller_type_data?.data.map((d) => ({
    value: d.id,
    label: d.name
  }));

  const items = data?.data || [];

  const onSubmitFilters = () => {
    setParams({
      category_id: category_id?.value || '',
      type_id: type_id?.value || '',
      location: location?.value || '',
      seller_type: seller_type?.value || '',
      size: size?.value || '',
      condition: condition?.value || '',
      keywords: keywords
    });
  };

  const handleClearFilters = () => {
    setCategoryId('');
    setTypeId('');
    setLocation('');
    setSellerType('');
    setSize('');
    setCondition('');
    setKeywords('');

    setParams({
      category_id: '',
      type_id: '',
      location: '',
      seller_type: '',
      size: '',
      condition: '',
      keywords: ''
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Product',
        attribute: 'title',
        render: (item) => {
          return (
            <ProductTitle
              generic_sku={item.generic_sku}
              title={item?.title}
              style={{ maxWidth: '350px' }}
            />
          );
        },
        filterable: false
      },
      {
        Header: 'Category',
        filterable: false,
        render: (item) => {
          const category = getItemById(item.category_id, category_options);

          return category?.label || '';
        }
      },
      {
        Header: 'Brand',
        filterable: false,
        render: (item) => {
          const product_type = getItemById(item.type_id, product_type_options);

          return product_type?.label || '';
        }
      },
      {
        Header: 'Location',
        filterable: false,
        render: (item) => item.location.name
      },
      {
        Header: 'Stock',
        filterable: false,
        attribute: 'quantity'
      }
    ],
    [category_options, product_type_options]
  );

  return (
    <div className="page-content list-items">
      <Container fluid>
        <BreadCrumb title="Quantities" pageTitle="Quantities" />
        <Row>
          <div className="col-xl-12">
            <div>
              <div className="card card-table-list">
                <div className="card-header border-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSubmitFilters();
                    }}
                  >
                    <div className="row g-4">
                      <div className="col-lg-3 col-md-4 col-sm-4">
                        <Select
                          placeholder="Category"
                          value={category_id}
                          onChange={setCategoryId}
                          options={category_options}
                          name="choices-publish-status-input"
                          classNamePrefix="select2-selection form-select"
                          backspaceRemovesValue
                          isClearable
                        />
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-4">
                        <Select
                          placeholder="Brand"
                          value={type_id}
                          onChange={setTypeId}
                          options={product_type_options}
                          name="choices-publish-status-input"
                          classNamePrefix="select2-selection form-select"
                          backspaceRemovesValue
                          isClearable
                        />
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-4">
                        <Select
                          placeholder="Location"
                          value={location}
                          onChange={setLocation}
                          options={location_options}
                          name="choices-publish-status-input"
                          classNamePrefix="select2-selection form-select"
                          backspaceRemovesValue
                          isClearable
                        />
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-4">
                        <Select
                          placeholder="Seller Type"
                          value={seller_type}
                          onChange={setSellerType}
                          options={seller_type_options}
                          name="choices-publish-status-input"
                          classNamePrefix="select2-selection form-select"
                          backspaceRemovesValue
                          isClearable
                        />
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-4">
                        <Select
                          placeholder="Size"
                          value={size}
                          onChange={setSize}
                          options={size_options}
                          name="choices-publish-status-input"
                          classNamePrefix="select2-selection form-select"
                          backspaceRemovesValue
                          isClearable
                        />
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-4">
                        <Select
                          placeholder="Condition"
                          value={condition}
                          onChange={setCondition}
                          options={condition_options}
                          name="choices-publish-status-input"
                          classNamePrefix="select2-selection form-select"
                          backspaceRemovesValue
                          isClearable
                        />
                      </div>
                      <div className="col-lg-6">
                        <div className="d-flex">
                          <div className="search-box flex-grow-1">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search by SKU, Name, Tag"
                              value={keywords}
                              onChange={(e) => setKeywords(e.target.value)}
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                          <div className="d-flex flex-wrap align-items-center gap-2 ms-2">
                            <Button
                              type="submit"
                              color="secondary"
                              outline
                              className="custom-toggle active"
                              onClick={onSubmitFilters}
                            >
                              <span className="icon-on">
                                <i className="ri-search-line search-icon align-bottom me-1"></i>
                                Search
                              </span>
                            </Button>
                          </div>
                          <div className="d-flex flex-wrap align-items-center gap-2 ms-2">
                            <Button
                              color=""
                              outline
                              className="custom-toggle active"
                              onClick={handleClearFilters}
                            >
                              Clear All
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="card-body">
                  <div
                    id="table-product-list-all"
                    className="table-card gridjs-border-none pb-2"
                  >
                    {isLoading || isFetching || (items && items.length > 0) ? (
                      <BTable
                        columns={columns}
                        data={items || []}
                        loading={isLoading || isFetching}
                      />
                    ) : (
                      <div className="py-4 text-center">
                        <div>
                          <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#405189,secondary:#0ab39c"
                            style={{ width: '72px', height: '72px' }}
                          ></lord-icon>
                        </div>

                        <div className="mt-4">
                          <h5>Sorry! No Result Found</h5>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  <BPagination
                    data={data}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default Quantities;
