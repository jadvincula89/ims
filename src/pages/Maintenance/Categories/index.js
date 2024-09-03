import React, { useEffect, useState, useMemo, useCallback } from 'react';

import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Row,
  Badge,
  Button,
  ButtonGroup
} from 'reactstrap';

import 'nouislider/distribute/nouislider.css';
import DeleteModal from '../../../Components/Common/DeleteModal';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';
//Import data
import { productsData } from '../../../common/data';
import CategoryModal from './CategoryModal';
import SizeBadge from '../../../Components/Common/SizeBadge';

import { isEmpty } from 'lodash';
import MsgToast from '../../../Components/Common/MsgToast';

import { Link } from 'react-router-dom';
import {
  useCategoryQuery,
  useCategoryCreateMutation,
  useCategoryUpdateMutation,
  useCategoryDeleteMutation
} from '../../../services/category';
import { useProductSizeQuery } from '../../../services/size';
import BTable from '../../../Components/Common/BTable';
const Categories = (props) => {
  const products = productsData;
  const isProductDelete = false;
  const isProductDeleteFail = false;

  const [productList, setProductList] = useState([]);
  const [params, setParams] = useState({});
  const [search, setSearch] = useState(null);
  const [product, setProduct] = useState(null);
  //delete order
  const { data, isFetching, reload } = useCategoryQuery(params);
  const [categoryCreate, { create_data, isSuccess: create_success }] =
    useCategoryCreateMutation();
  const [categoryUpdate] = useCategoryUpdateMutation();
  const { data: sizes } = useProductSizeQuery();
  const [categoryDelete] = useCategoryDeleteMutation();
  const [deleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter_status, setFilterStatus] = useState('Active');
  const [payload, setPayload] = useState({
    sizes: [],
    products: [],
    selected_sizes: [],
    name: '',
    status: 1,
    reference: 0,
    subcategory: [],
    delete: []
  });
  const [alert, setAlert] = useState([
    { success: false, failure: false, message: '', isEdit: false }
  ]);
  const handleSearch = () => {
    if (search) {
      setParams({ keywords: search });
    } else setParams({});
  };
  const handleSearchByStatus = (value) => {
    if (Object.keys(params).length > 0) {
      const data = { ...params } || [];
      data['status'] = value;
      setParams(data);
    }
    setParams({ status: value });

    const f_status = {
      0: 'Inactive',
      1: 'Active',
      2: 'All'
    };

    setFilterStatus(f_status[value]);
  };
  const handleUpdateCategoryModal = useCallback(
    (category) => {
      setAlert({ ...alert, isEdit: true });
      let array_size = [];
      let array_sub_category = [];
      if (category.subcategory) {
        category.subcategory.split('|').forEach((element) => {
          array_sub_category.push({ label: element, value: element });
        });
      }
      category.sizes
        .filter((item) => item.selected === true)
        .map((element) => {
          return array_size.push({ id: element.id });
        });
      setPayload({
        id: category.id,
        name: category.name,
        status: category.status,
        selected_sizes: category.sizes,
        reference: category.reference,
        subcategory: array_sub_category,
        sizes: array_size,
        delete: []
      });

      setShowModal(true);
    },
    [alert]
  );
  const handleCheckboxChange = (event) => {
    if (event.target.checked === true) {
      let temp = [];
      temp = payload.sizes;
      temp.push({ id: event.target.value });
      setPayload({ ...payload, sizes: temp });
    } else if (event.target.checked === false) {
      let temp = [];

      let valueToRemove = event.target.value;

      let indexToRemove = temp.indexOf(valueToRemove);

      if (indexToRemove !== -1) {
        temp.splice(indexToRemove, 1);
      }
      if (alert.isEdit === true) {
        let del = [];
        del = payload.delete;
        del.push({ id: event.target.value });

        setPayload({ ...payload, delete: del });
      }
    }
  };

  const submitCreate = async (params) => {
    let response;
    let tempstr = [];
    let subcategory = '';
    params.subcategory.forEach((item, index) => {
      tempstr.push(item.value.replace('|', ''));
    });
    if (tempstr.length > 0) {
      subcategory = tempstr.join('|');
    }
    let parameters = {
      id: params.id,
      name: params.name,
      status: params.status,
      subcategory: subcategory,
      reference: parseInt(params.reference),
      delete: payload.delete,
      sizes: JSON.parse(JSON.stringify(payload.sizes))
    };
    if (alert.isEdit === false) {
      response = await categoryCreate(parameters);
    } else if (alert.isEdit === true) {
      response = await categoryUpdate(parameters);
    }

    if (response.data) {
      setAlert({
        ...alert,
        failure: false,
        success: true,
        message: response.data.message
      });
      setShowModal(false);
      setTimeout(() => {
        setAlert({ ...alert, success: false, message: response.data.message });
      }, 3000);
    } else if (response.error.status === 404) {
      let newmessage = response.error.data.message.replace('.', '. \n');

      setAlert({
        ...alert,
        failure: true,
        success: false,
        message: newmessage
      });
    } else if (response.error.status === 'FETCH_ERROR') {
      setAlert({
        ...alert,
        failure: true,
        success: false,
        message:
          'An unexpected error was encountered. Please contact your administrators'
      });
    }
    // const xhr = await sizeCreate({ ...form, visible: status.value || 0, parent_id: 0 });
  };
  const onClickDelete = (product) => {
    setProduct(product);
    setDeleteModal(true);
  };
  const handleAddCategoryModal = () => {
    setAlert({ ...alert, isEdit: false });
    setPayload({ ...payload, name: '', status: 1, sizes: [], subcategory: [] });
    setShowModal(true);
  };

  const handleDeleteProduct = async () => {
    if (product) {
      let response = await categoryDelete(product);

      if (response.data) {
        setAlert({
          ...alert,
          failure: false,
          success: true,
          message: response.data.message
        });
        setDeleteModal(false);
        setTimeout(() => {
          setAlert({
            ...alert,
            success: false,
            message: response.data.message
          });
        }, 3000);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        render: (data) => {
          return data.id;
        }
      },
      {
        Header: 'Categories',
        render: (data) => (
          <h5 className="fs-14 mb-1">
            <Link
              className="text-dark"
              state={{
                data: data.name
              }}
              onClick={() => {
                handleUpdateCategoryModal(data);
              }}
            >
              {' '}
              {data.name}
            </Link>
          </h5>
        )
      },
      {
        Header: 'Sub Categories',
        render: (data) => (
          <div className="hstack gap-1">
            {data?.subcategory?.length > 0 &&
              data?.subcategory.split('|').map((item) => (
                <Badge key={item} color="primary">
                  {' '}
                  {item}{' '}
                </Badge>
              ))}
          </div>
        )
      },
      {
        Header: 'Sizes',
        render: (data) => (
          <div>{data?.sizes && <SizeBadge sizes={data.sizes} />}</div>
        )
      },
      {
        Header: 'Stock',
        render: (data) => {
          return (
            <h5 className="fs-14 mb-1">
              {Intl.NumberFormat('en-US', { type: 'decimal' }).format(
                data.product_variants
              )}
            </h5>
          );
        }
      },
      {
        Header: 'Status',
        attribute: 'status',
        filterable: false,
        render: (product) => {
          if (product?.status === 1) {
            return <span className="badge bg-success">{'Active'}</span>;
          } else {
            return <span className="badge bg-danger">{'Not Active'}</span>;
          }
        }
      },
      {
        Header: 'Action',
        render: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle
                href="#"
                className="btn-soft-secondary btn-sm"
                tag="button"
              >
                <i className="ri-more-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end" container="body">
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const productData = cellProps;
                    handleUpdateCategoryModal(productData);
                  }}
                >
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{' '}
                  Edit
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const productData = cellProps;
                    onClickDelete(productData);
                  }}
                >
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{' '}
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        }
      }
    ],
    [handleUpdateCategoryModal]
  );
  document.title = 'Category Maintenance';

  return (
    <div className="page-content list-items">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <CategoryModal
        show={showModal}
        data={payload}
        sizes={sizes?.data || []}
        handleCheckboxChange={handleCheckboxChange}
        handleChangeValue={setPayload}
        onClickCreate={submitCreate}
        alert={alert}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setShowModal(false)}
      />
      <Container fluid>
        <BreadCrumb
          title="Category Maintenance"
          pageTitle="Category Maintenance"
        />
        {alert.success === true ? (
          <MsgToast
            msg={alert.message}
            color="success"
            icon="ri-checkbox-circle-line"
          />
        ) : null}

        <div className="card card-list">
          <div className="card-header border-0">
            <div className="row g-5">
              <div className="col-sm-auto">
                <div>
                  <Button
                    onClick={handleAddCategoryModal}
                    className="btn btn-success"
                  >
                    <i className="ri-add-line align-bottom me-1"></i> Add New
                    Category
                  </Button>
                </div>
              </div>
              <div className="col-sm">
                <div className="d-flex justify-content-sm-end col-md-6 "></div>
                <div className="d-flex justify-content-sm-end ">
                  <div className="search-box ms-2 col-md-3 ">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setSearch(e.target.value || undefined);
                        }}
                        placeholder="Search By Category,Sub and Sizes"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </form>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-2 ms-2">
                    <Button
                      color="secondary"
                      outline
                      onClick={handleSearch}
                      className="custom-toggle active"
                    >
                      <span className="icon-on">
                        <i className="ri-search-line search-icon align-bottom me-1"></i>
                        Search
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-sm-auto">
                <ButtonGroup className="material-shadow">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      tag="button"
                      className="btn btn-light material-shadow-none"
                    >
                      {filter_status || 'All'}{' '}
                      <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() => {
                          handleSearchByStatus(1);
                        }}
                      >
                        Active
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          handleSearchByStatus(0);
                        }}
                      >
                        Inactive
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem
                        onClick={() => {
                          handleSearchByStatus(2);
                        }}
                      >
                        All
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </ButtonGroup>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div
              id="table-product-list-all"
              className="table-card gridjs-border-none pb-2"
            >
              {data?.data && !isFetching > 0 ? (
                <BTable data={data?.data || []} columns={columns} />
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
            {isProductDelete ? (
              <MsgToast
                msg="Product Deleted Successfully"
                color="success"
                icon="ri-checkbox-circle-line"
              />
            ) : null}
            {isProductDeleteFail ? (
              <MsgToast
                msg="Product Deleted Failed"
                color="danger"
                icon="ri-error-warning-line"
              />
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Categories;
