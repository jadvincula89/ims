import React, { useEffect, useState, useMemo } from 'react';
import SimpleBar from 'simplebar-react';
import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledCollapse,
  UncontrolledButtonDropdown,
  Row,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Col,
  Input,
  Label,
  Dropdown
} from 'reactstrap';
import classnames from 'classnames';

import un_placeholder from '../../../assets/images/un_logo.png';

// RangeSlider
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import DeleteModal from '../../../Components/Common/DeleteModal';
import Filter from './Filter';

import { useCategoryQuery } from '../../../services/category';
import { useListQuery as useProductTypeListQuery } from '../../../services/product_type';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';
import { Rating, Published, Price } from './ProductCol';
import './scss/add_product.scss';
//Import data
import { productsData } from '../../../common/data';

//Import actions
import { isEmpty } from 'lodash';
import Select from 'react-select';
import MsgToast from '../../../Components/Common/MsgToast';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDeleteProductMutation } from '../../../services/product';
import BTable from '../../../Components/Common/BTable';
import { DEFAULT_PER_PAGE } from '../../../common/constants';
import BPagination from '../../../Components/Common/BPagination';
import { useListQuery, useLazyListQuery } from '../../../services/product';
import LedgerModal from './LedgerModal';
import { STOCK_QUANTITY_OPTIONS } from '../../../common/constants/options';
import { genericSKUBreakdown } from '../../../common/helpers/product';

const STATUS_OPTIONS = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 3 },
  { type: 'divider' },
  { label: 'All', value: 2 }
];

const Products = (props) => {
  const dispatch = useDispatch();

  const products = productsData;
  const isProductDeleteFail = false;
  const [isProductDelete, setIsProductDelete] = useState(false);

  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [keywords, setKeywords] = useState('');
  const [selected_status, setSelectedStatus] = useState({
    label: 'Active',
    value: 1
  });
  const [status, setStatus] = useState(1);
  const [seller_type, setSellerType] = useState({
    label: 'All',
    value: 3
  });
  const [sellertype, setSellertype] = useState(3);
  const [params, setParams] = useState({});
  const [payload, setPayload] = useState({
    category: null,
    product_type: null
  });
  const [search, setSearch] = useState(null);
  const { data: product_list, isLoading } = useListQuery({
    ...params,
    keywords,
    page,
    per_page,
    status,
    sellertype
  });
  const [deleteProduct, { isSuccess: create_success, isError: create_error }] =
    useDeleteProductMutation();
  const {
    data: category,
    isFetching,
    reload
  } = useCategoryQuery({ status: 2 });
  const { data: brand } = useProductTypeListQuery();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState(null);
  const [brands, setBrands] = useState(null);
  //delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [filter_status, setFilterStatus] = useState('Active');
  const [shownoCategory, setNoCategory] = useState(true);
  const [show_ledger_modal, setShowLedgerModal] = useState(false);
  const [ledger__modal_data, setLedgerModalData] = useState({});

  const [is_open_status_dropdown, setIsOpenStatusDropdown] = useState(false);

  const onClickDelete = (product) => {
    setProduct(product);
    setDeleteModal(true);
  };

  const checkAll = async (bools) => {
    if (bools) {
      if (category?.data && brand?.data) {
        const categoryIds = await category.data.map((item) => item.id);
        const brandIds = await brand.data.map((item) => item.id);

        setPayload({
          ...payload,
          category: categoryIds,
          product_type: brandIds,
          no_category: 1
        });
      }
    } else {
      setPayload({ ...payload, category: [], product_type: [] });
    }
  };

  const handleFilter = async () => {
    const category = payload.category.join(',');
    const brand = payload.product_type.join(',');
    let no_category = 0;

    if (payload.category === null) {
      if (category && brand) {
        let categoryIds = await category?.data.map((item) => item.id);

        if (shownoCategory) {
          no_category = 1;
        } else {
          no_category = 0;
        }
        let brandIds = await brand?.data.map((item) => item.id);
        setPayload({
          ...payload,
          category: categoryIds,
          no_category: no_category,
          product_type: brandIds
        });
      }
    }
    if (shownoCategory) {
      no_category = 1;
    } else {
      no_category = 0;
    }

    setParams({ ...params, category, brand, no_category });
  };
  useEffect(() => {
    if (category?.data && !isFetching) {
      setCategories(
        category?.data?.map((item) => ({ ...item, checked: true }))
      );

      checkAll(true);
    }

    if (brand) {
      setBrands(brand.data?.map((item) => ({ ...item, checked: true })));
    }

    /* eslint-disable */
  }, [category, brand, isFetching]);
  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;

    const updatePayloadArray = (key) => {
      const temp = [...payload[key]];

      if (checked) {
        temp.push(parseInt(value));
      } else {
        const indexToRemove = temp.indexOf(parseInt(value));
        if (indexToRemove !== -1) {
          temp.splice(indexToRemove, 1);
        }
      }

      setPayload((prevPayload) => ({ ...prevPayload, [key]: temp }));
    };

    if (name === 'category' || name === 'product_type') {
      updatePayloadArray(name);
    }
  };

  const handleDeleteProduct = () => {
    if (product) {
      deleteProduct(product.id);
      setDeleteModal(false);
      setIsProductDelete(true, () => setIsProductDelete(false));
    }
  };

  const handleSearch = () => {
    setKeywords(search || '');

    const d = { ...params };
    if (!!search) d['keywords'] = search || '';
    setParams(d);
  };
  const handleFilterBySellerType = (obj) => {
    setSellerType(obj);
    setSellertype(obj.value);
  };
  const handleSearchByStatus = (value) => {
    if (Object.keys(params).length > 0) {
      const d = { ...params } || [];

      d['status'] = value;
      setParams(d);
    }
    setParams({ status: value });

    const f_status = {
      3: 'Inactive',
      1: 'Active',
      2: 'All'
    };

    setFilterStatus(f_status[value]);
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        render: (product) => product.id
      },
      {
        Header: 'Product Title',
        render: (product) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="avatar-md bg-light rounded p-1 d-flex justify-content-center align-content-center">
                  <img
                    src={product.images || un_placeholder}
                    alt={product.title}
                    onError={(e) => (e.target.src = un_placeholder)}
                    className="img-fluid d-block product-img"
                  />
                </div>
              </div>
              <div className="flex-grow-1">
                <h5 className="fs-14 mb-1">
                  <Link
                    to={`/app/products/${product.id}/edit`}
                    className="text-dark"
                    state={{
                      data: product
                    }}
                  >
                    {' '}
                    {product.title}
                  </Link>
                </h5>
              </div>
            </div>
          </>
        )
      },
      {
        Header: 'Category',
        attribute: 'category',
        filterable: false
      },
      {
        Header: 'Stock',
        attribute: 'variants',
        filterable: false,
        render: (product) => {
          return (
            <Link className="text-dark">
              {Intl.NumberFormat('en-US', { type: 'decimal' }).format(
                product.variants
                  .filter((variant) =>
                    (seller_type.value === 1
                      ? [1]
                      : seller_type.value === 2
                      ? [2, 3]
                      : [1, 2, 3]
                    ).includes(variant.seller_type)
                  )
                  .reduce((acc, variant) => {
                    const quantity = parseInt(variant.quantity, 10);

                    if (!isNaN(quantity)) {
                      return acc + quantity;
                    }

                    return acc;
                  }, 0)
              )}
            </Link>
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
                <DropdownItem tag={Link} to={`${cellProps.id}/edit`}>
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{' '}
                  Edit
                </DropdownItem>
                <DropdownItem
                  to={cellProps.id}
                  onClick={(_) => {
                    setShowLedgerModal(true);
                    setLedgerModalData(cellProps);
                  }}
                >
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{' '}
                  View Ledger
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
    [seller_type]
  );

  document.title = 'Products | UN Inventory Management System';

  return (
    <div className="page-content list-items" id="Products">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <LedgerModal
        show={show_ledger_modal}
        setShowModal={setShowLedgerModal}
        data={ledger__modal_data}
      />
      <Container fluid>
        <BreadCrumb title="Products" pageTitle="Ecommerce" />
        <div className="card card-list">
          <div className="card-header border-0">
            <div className="row g-4">
              <div className="col-sm-auto">
                <div>
                  <Link to="/app/products/new" className="btn btn-success">
                    <i className="ri-add-line align-bottom me-1"></i> Add
                    Product
                  </Link>
                </div>
              </div>
              <div className="col-sm">
                <div className="d-flex justify-content-sm-end">
                  <div className="search-box col-md-3">
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
                          setSearch(e.target.value || '');
                          setPage(1);
                        }}
                        value={search || ''}
                        placeholder="Search by Title,Category or Generic SKU"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </form>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-2 ms-2">
                    <Button
                      color="secondary"
                      outline
                      onClick={() => {
                        handleSearch();
                      }}
                      className="custom-toggle active"
                    >
                      <span className="icon-on">
                        <i className="ri-search-line search-icon align-bottom me-1"></i>
                        Search
                      </span>
                    </Button>
                  </div>

                  <div className="ms-2">
                    <Filter
                      handleCheckboxChange={handleCheckboxChange}
                      onClickFilter={handleFilter}
                      setnoCat={setNoCategory}
                      shownoCategory={shownoCategory}
                      checkAll={checkAll}
                      category={categories}
                      updateCategories={setCategories}
                      updateBrands={setBrands}
                      brand={brands}
                    />
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
                      {seller_type?.label || 'UN'}{' '}
                      <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu className="notify-item language py-2">
                      {STOCK_QUANTITY_OPTIONS.map((o, i) => {
                        if (o.type === 'divider')
                          return <DropdownItem key={`divider_${i}`} divider />;
                        return (
                          <DropdownItem
                            key={o.value}
                            onClick={() => handleFilterBySellerType(o)}
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
                <ButtonGroup className="material-shadow w-100">
                  <Dropdown
                    isOpen={is_open_status_dropdown}
                    toggle={() =>
                      setIsOpenStatusDropdown(!is_open_status_dropdown)
                    }
                    className=""
                  >
                    <DropdownToggle
                      tag="button"
                      className="btn btn-light material-shadow-none"
                    >
                      {selected_status.label || 'Active'}{' '}
                      <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu className="notify-item language py-2">
                      {STATUS_OPTIONS.map((o, i) => {
                        if (o.type === 'divider')
                          return <DropdownItem key={`divider_${i}`} divider />;
                        return (
                          <DropdownItem
                            key={o.value}
                            onClick={() => {
                              setSelectedStatus(o);
                              setStatus(o.value);
                            }}
                            className={`${
                              status === o.value ? 'active' : 'none'
                            }`}
                          >
                            <span className="align-middle">{o.label}</span>
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
                </ButtonGroup>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div
              id="table-product-list-all"
              className="table-card gridjs-border-none pb-2"
            >
              {product_list?.data && product_list?.data.length > 0 ? (
                <BTable columns={columns} data={product_list.data || []} />
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
              data={product_list}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Products;
