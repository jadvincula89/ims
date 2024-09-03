import React, { useEffect, useState, useMemo } from 'react';

import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Row,
  Button,
  ButtonGroup
} from 'reactstrap';

import 'nouislider/distribute/nouislider.css';
import DeleteModal from '../../../Components/Common/DeleteModal';
import SizeModal from './SizeModal';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';
//Import data
import { productsData } from '../../../common/data';

import { isEmpty } from 'lodash';
import MsgToast from '../../../Components/Common/MsgToast';

import { Link } from 'react-router-dom';
import {
  useProductSizeQuery,
  useSizeCreateMutation,
  useSizeUpdateMutation,
  useSizeDeleteMutation
} from '../../../services/size';
import BTable from '../../../Components/Common/BTable';
import BPagination from '../../../Components/Common/BPagination';
import { DEFAULT_PER_PAGE } from '../../../common/constants';
import {
  SELLER_TYPE,
  SELLER_TYPE_LABEL,
  STOCK_QUANTITY_OPTIONS
} from '../../../common/constants/options';

const Sizes = (props) => {
  const products = productsData;
  const isProductDelete = false;
  const isProductDeleteFail = false;
  const [form, setForm] = useState({
    symbol: '',
    name: '',
    status: 1
  });
  const [product, setProduct] = useState(null);
  const [alert, setAlert] = useState([
    { success: false, failure: false, message: '', isEdit: false }
  ]);
  const [status, setStatus] = useState([
    { label: 'Active', value: 1 },
    { label: 'Not Active', value: 0 }
  ]);
  const [seller_type, setSellerType] = useState({
    label: SELLER_TYPE_LABEL.ALL,
    value: SELLER_TYPE.ALL
  });
  const [params, setParams] = useState({});
  const [search_param, setSearchParam] = useState('');
  const [search, setSearch] = useState(null);
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const { data, isFetching, reload } = useProductSizeQuery({
    ...params,
    page,
    per_page,
    keywords: search_param
  });
  const [sizeCreate, { create_data, isSuccess: create_success }] =
    useSizeCreateMutation();
  const [sizeUpdate] = useSizeUpdateMutation();
  const [sizeDelete] = useSizeDeleteMutation();
  const [deleteModal, setDeleteModal] = useState(false);
  const [sizeModal, setSizeModal] = useState(false);
  const [filter_status, setFilterStatus] = useState('Active');

  const onClickDelete = (product) => {
    setProduct(product);
    setDeleteModal(true);
  };

  const handleSearch = () => {
    setSearchParam(search);
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

  const handleUpdateSizeModal = (product) => {
    setAlert({ ...alert, isEdit: true });
    setForm({
      symbol: product.symbol,
      name: product.name,
      status: product.status,
      id: product.id
    });
    setSizeModal(true);
  };

  const submitCreate = async (params) => {
    let response;
    if (alert.isEdit === false) {
      response = await sizeCreate(params);
    } else if (alert.isEdit === true) {
      response = await sizeUpdate(params);
    }

    if (response.data) {
      setAlert({
        ...alert,
        failure: false,
        success: true,
        message: response.data.message
      });
      setSizeModal(false);
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

  const handleDeleteProduct = async () => {
    if (product) {
      let response = await sizeDelete(product);
      setDeleteModal(false);
      if (response.data) {
        setAlert({
          ...alert,
          failure: false,
          success: true,
          message: response.data.message
        });
        setSizeModal(false);
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

  const handleAddSizeModal = () => {
    setAlert({ ...alert, isEdit: false });
    setSizeModal(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Order',
        render: (data) => {
          return data.order_no;
        }
      },
      {
        Header: 'Sizes',
        render: (data) => (
          <h5 className="fs-14 mb-1">
            <Link
              className="text-dark"
              state={{
                data: data.name
              }}
              onClick={() => {
                handleUpdateSizeModal(data);
              }}
            >
              {' '}
              {data.name}
            </Link>
          </h5>
        )
      },
      {
        Header: 'Symbol',
        render: (data) => <h5 className="fs-14 mb-1">{data.symbol}</h5>
      },
      {
        Header: 'Stock',
        render: (size) => {
          let total = 0;

          if (seller_type.value === 1) {
            total = size.un_stock || 0;
          } else if (seller_type.value === 2) {
            total = size.non_un_stock || 0;
          } else {
            total = +size.non_un_stock + +size.un_stock || 0;
          }

          return (
            <Link className="text-dark">
              {' '}
              {Intl.NumberFormat('en-US', { type: 'decimal' }).format(total)}
            </Link>
          );
        }
      },
      {
        Header: 'Status',
        accessor: 'status',
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
                    handleUpdateSizeModal(productData);
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
    /* eslint-disable */
    [seller_type]
  );
  document.title = 'Product Sizes';

  return (
    <div className="page-content list-items">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <SizeModal
        show={sizeModal}
        alert={alert}
        handleChangeValue={setForm}
        data={form}
        status={status}
        onClickCreate={submitCreate}
        onCloseClick={() => setSizeModal(false)}
      />
      <Container fluid>
        <BreadCrumb title="Sizes" pageTitle="Sizes" />
        {alert.success === true ? (
          <MsgToast
            msg={alert.message}
            color="success"
            icon="ri-checkbox-circle-line"
          />
        ) : null}
        <div className="card card-list">
          <div className="card-header border-0">
            <div className="row g-4">
              <div className="col-sm-auto">
                <div>
                  <Button
                    onClick={handleAddSizeModal}
                    className="btn btn-success"
                  >
                    <i className="ri-add-line align-bottom me-1"></i> Add New
                    Size
                  </Button>
                </div>
              </div>
              <div className="col-sm">
                <div className="d-flex justify-content-sm-end">
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
                        placeholder="Search by size name or symbol"
                        value={search || ''}
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
              <div className="col-sm-auto ps-0">
                <ButtonGroup className="material-shadow w-100">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      tag="button"
                      className="btn btn-light material-shadow-none"
                    >
                      {seller_type?.label || SELLER_TYPE_LABEL.ALL}{' '}
                      <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu className="notify-item language py-2">
                      {STOCK_QUANTITY_OPTIONS.map((o, i) => {
                        if (o.type === 'divider')
                          return <DropdownItem key={`divider_${i}`} divider />;
                        return (
                          <DropdownItem
                            key={o.value}
                            onClick={() => setSellerType(o)}
                            className={`${
                              seller_type?.value === o.value ? 'active' : 'none'
                            }`}
                          >
                            <span className="align-middle">{o.label}</span>
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </ButtonGroup>
              </div>
              <div className="col-sm-auto ps-0">
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
                <BTable columns={columns} data={data?.data || []} />
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
          <div className="card-footer">
            <BPagination
              data={data}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Sizes;
