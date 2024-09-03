import React, { useEffect, useState, useMemo } from 'react';

import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Row
} from 'reactstrap';

import 'nouislider/distribute/nouislider.css';
import DeleteModal from '../../../Components/Common/DeleteModal';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';
//Import data
import { productsData } from '../../../common/data';

import { isEmpty } from 'lodash';
import MsgToast from '../../../Components/Common/MsgToast';

import { Link } from 'react-router-dom';
import { useProductTypeQuery } from '../../../services/category';

const ProductTypes = (props) => {
  const products = productsData;
  const isProductDelete = false;
  const isProductDeleteFail = false;

  const [productList, setProductList] = useState([]);
  const [product, setProduct] = useState(null);
  //delete order
  const { data } = useProductTypeQuery();
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
        Header: 'ID',
        Cell: (data) => {
          return data.row.original.id;
        }
      },
      {
        Header: 'Categories',
        Cell: (data) => (
          <h5 className="fs-14 mb-1">
            <Link
              to={`/app/categories/${data.row.original.id}`}
              className="text-dark"
              state={{
                data: data.row.original.name
              }}
            >
              {' '}
              {data.row.original.name}
            </Link>
          </h5>
        )
      },
      {
        Header: 'Sizes',
        Cell: (data) => (
          <h5 className="fs-14 mb-1">
            {data.row.original?.sizes &&
              data.row.original.sizes
                .map(function (v) {
                  return v.symbol;
                })
                .join(', ')}
          </h5>
        )
      },
      {
        Header: 'Stock',
        Cell: (data) => <h5 className="fs-14 mb-1">{'2000'}</h5>
      },
      {
        Header: 'Status',
        accessor: 'status',
        filterable: false,
        Cell: (product) => {
          if (product?.row.original.status === 1) {
            return <span className="badge bg-primary">{'Active'}</span>;
          } else {
            return <span className="badge bg-danger">{'Not Active'}</span>;
          }
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
                <DropdownItem
                  tag={Link}
                  to={`/app/categories/${cellProps.row.id}/edit`}
                >
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
                          to="/app/categories/new"
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          New Category
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
                    {data?.data && data?.data.length > 0 ? (
                      <TableContainer
                        columns={columns}
                        data={data?.data || []}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={100}
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
