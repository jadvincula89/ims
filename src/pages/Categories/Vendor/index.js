import React, { useMemo, useState } from 'react';

import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown
} from 'reactstrap';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';

import { Link } from 'react-router-dom';
import { useVendorQuery } from '../../../services/category';

const VendorList = (props) => {
  const { data } = useVendorQuery();

  const vendor_list = data?.items || [];
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (product) => {
    // setProduct(product);
    setDeleteModal(true);
  };

  const handleDeleteProduct = () => {
    // if (product) {
    setDeleteModal(false);
    // }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        Cell: (item) => {
          return item.row.original.id;
        }
      },
      {
        Header: 'Name',
        Cell: (item) => (
          <h5 className="fs-14 mb-1">
            <Link
              to={`/app/categories/vendors/${item.row.original.id}`}
              className="text-dark"
              state={{
                data: item.row.original
              }}
            >
              {' '}
              {item.row.original.name}
            </Link>
          </h5>
        )
      },
      {
        Header: 'Status',
        Cell: (item) => (item.row.original.visible ? 'Enabled' : 'Disabled')
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
                  to={`/app/categories/vendors/${cellProps.row.original.id}/edit`}
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

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Vendors" pageTitle="Vendors" />
        <Row>
          <div className="col-xl-12">
            <div>
              <div className="card">
                <div className="card-header border-0">
                  <div className="row g-4">
                    <div className="col-sm-auto">
                      <div>
                        <Link
                          to="/app/categories/vendors/new"
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          New Vendor
                        </Link>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="d-flex justify-content-sm-end">
                        <div className="search-box ms-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Vendor..."
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
                    {vendor_list && vendor_list.length > 0 ? (
                      <TableContainer
                        columns={columns}
                        data={vendor_list || []}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={100}
                        divClass="table-responsive mb-1"
                        tableClass="mb-0 align-middle table-borderless"
                        theadClass="table-light text-muted"
                        s
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
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default VendorList;
