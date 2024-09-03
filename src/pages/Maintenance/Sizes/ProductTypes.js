import React, { useEffect, useState, useMemo } from 'react';

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
  Row,
  Card,
  CardHeader,
  Col
} from 'reactstrap';
import classnames from 'classnames';

// RangeSlider
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import DeleteModal from '../../../Components/Common/DeleteModal';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';
import { Rating, Published, Price } from './ProductCol';
//Import data
import { productsData } from '../../../common/data';

//Import actions
// import { getProducts as onGetProducts, deleteProducts, resetEcomFlag } from "../../../store/ecommerce/action";
import { isEmpty } from 'lodash';
import Select from 'react-select';
import MsgToast from '../../../Components/Common/MsgToast';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const SingleOptions = [
  { value: 'Watches', label: 'Watches' },
  { value: 'Headset', label: 'Headset' },
  { value: 'Sweatshirt', label: 'Sweatshirt' },
  { value: '20% off', label: '20% off' },
  { value: '4 star', label: '4 star' }
];

const ProductTypes = (props) => {
  const products = productsData;
  const isProductDelete = false;
  const isProductDeleteFail = false;

  const [productList, setProductList] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedMulti, setselectedMulti] = useState(null);
  const [product, setProduct] = useState(null);

  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }

  useEffect(() => {
    if (!isEmpty(products)) setProductList(products);
  }, [products]);

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredProducts = products;
      if (type !== 'all') {
        filteredProducts = products.filter(
          (product) => product.status === type
        );
      }
      setProductList(filteredProducts);
    }
  };

  const [cate, setCate] = useState('all');

  const categories = (category) => {
    let filteredProducts = products;
    if (category !== 'all') {
      filteredProducts = products.filter(
        (product) => product.category === category
      );
    }
    setProductList(filteredProducts);
    setCate(category);
  };

  const onUpdate = (value) => {
    setProductList(
      productsData.filter(
        (product) => product.price >= value[0] && product.price <= value[1]
      )
    );
  };

  const [ratingvalues, setRatingvalues] = useState([]);
  /*
  on change rating checkbox method
  */
  const onChangeRating = (value) => {
    setProductList(productsData.filter((product) => product.rating >= value));

    var modifiedRating = [...ratingvalues];
    modifiedRating.push(value);
    setRatingvalues(modifiedRating);
  };

  const onUncheckMark = (value) => {
    var modifiedRating = [...ratingvalues];
    const modifiedData = (modifiedRating || []).filter((x) => x !== value);
    /*
    find min values
    */
    var filteredProducts = productsData;
    if (modifiedData && modifiedData.length && value !== 1) {
      var minValue = Math.min(...modifiedData);
      if (minValue && minValue !== Infinity) {
        filteredProducts = productsData.filter(
          (product) => product.rating >= minValue
        );
        setRatingvalues(modifiedData);
      }
    } else {
      filteredProducts = productsData;
    }
    setProductList(filteredProducts);
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (product) => {
    setProduct(product);
    setDeleteModal(true);
  };

  const handleDeleteProduct = () => {
    if (product) {
      setDeleteModal(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        Cell: () => {
          return <input type="checkbox" />;
        }
      },
      {
        Header: 'Product Categories',
        Cell: (product) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="avatar-sm bg-light rounded p-1">
                  <img
                    src={
                      process.env.REACT_APP_API_URL +
                      '/images/products/' +
                      product.row.original.image
                    }
                    alt=""
                    className="img-fluid d-block"
                  />
                </div>
              </div>
              <div className="flex-grow-1">
                <h5 className="fs-14 mb-1">
                  <Link
                    to={`/app/products/${product.row.original.id}`}
                    className="text-dark"
                  >
                    {' '}
                    {product.row.original.name}
                  </Link>
                </h5>
                <p className="text-muted mb-0">
                  Category :{' '}
                  <span className="fw-medium">
                    {' '}
                    {product.row.original.category}
                  </span>
                </p>
              </div>
            </div>
          </>
        )
      },
      {
        Header: 'Stock',
        accessor: 'stock',
        filterable: false
      },
      {
        Header: 'Price',
        accessor: 'price',
        filterable: false,
        Cell: (cellProps) => {
          return <Price {...cellProps} />;
        }
      },
      {
        Header: 'Orders',
        accessor: 'orders',
        filterable: false
      },
      {
        Header: 'Rating',
        accessor: 'rating',
        filterable: false,
        Cell: (cellProps) => {
          return <Rating {...cellProps} />;
        }
      },
      {
        Header: 'Published',
        accessor: 'publishedDate',
        filterable: false,
        Cell: (cellProps) => {
          return <Published {...cellProps} />;
        }
      },
      {
        Header: 'Action',
        Cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle
                href="#"
                className="btn-soft-secondary btn-sm"
                tag="button"
              >
                <i className="ri-more-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem href="apps-ecommerce-product-details">
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{' '}
                  View
                </DropdownItem>

                <DropdownItem href="apps-ecommerce-add-product">
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{' '}
                  Edit
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const productData = cellProps.row.original;
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
    []
  );
  document.title = 'Product Categories';

  return (
    <div className="page-content">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Container fluid>
        <BreadCrumb title="Product Categories" pageTitle="Product Categories" />

        <Row>
          <div className="col-xl-12">
            <div>
              <div className="card">
                <div className="card-header border-0">
                  <div className="row g-4">
                    <div className="col-sm-auto">
                      <div>
                        <Link
                          to="/app/products/new"
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Product Type
                        </Link>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="d-flex justify-content-sm-end">
                        <div className="search-box ms-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Product Type..."
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div
                    id="table-product-list-all"
                    className="table-card gridjs-border-none pb-2"
                  >
                    {productList && productList.length > 0 ? (
                      <TableContainer
                        columns={columns}
                        data={productList || []}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={10}
                        divClass="table-responsive mb-1"
                        tableClass="mb-0 align-middle table-borderless"
                        theadClass="table-light text-muted"
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
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default ProductTypes;
