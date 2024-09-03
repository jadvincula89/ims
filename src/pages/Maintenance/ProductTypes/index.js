import React, { useEffect, useMemo, useState } from 'react';

import {
  Button,
  ButtonGroup,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  ModalFooter,
  Row,
  Spinner,
  UncontrolledDropdown
} from 'reactstrap';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';

import { Link } from 'react-router-dom';
import { useProductTypesQuery } from '../../../services/maintenance';
import { useAsyncDebounce } from 'react-table';
import BModal from '../../../Components/Common/Modal';
import AddModal from './AddModal';
import {
  useDeleteMutation,
  useListQuery
} from '../../../services/product_type';
import DeleteModal from '../../../Components/Common/DeleteModal';
import { toast } from 'react-toastify';
import BPagination from '../../../Components/Common/BPagination';
import { DEFAULT_PER_PAGE } from '../../../common/constants';
import BTable from '../../../Components/Common/BTable';
import {
  SELLER_TYPE,
  SELLER_TYPE_LABEL,
  STOCK_QUANTITY_OPTIONS
} from '../../../common/constants/options';

export const MODAL_TYPE = {
  CREATE: 1,
  UPDATE: 2
};

const ProductTypeList = (props) => {
  const [keywords, setKeywords] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [params, setParams] = useState({});
  const [seller_type, setSellerType] = useState({
    label: SELLER_TYPE_LABEL.ALL,
    value: SELLER_TYPE.ALL
  });
  const { data, isLoading, isFetching } = useListQuery({
    ...params,
    seller_type: seller_type.value,
    keywords,
    page,
    per_page
  });
  const [
    deleteProductType,
    { error, isSuccess: delete_success, isError: delete_error }
  ] = useDeleteMutation();
  const vendor_list = data?.data || [];
  const [add_show_modal, setShowAddModal] = useState(false);
  const [modal_type, setModalType] = useState(MODAL_TYPE.CREATE);
  const [modal_data, setModalData] = useState(undefined);
  const [delete_modal, setDeleteModal] = useState(false);
  const [for_delete, setForDelete] = useState(undefined);
  const [filter_status, setFilterStatus] = useState('Active');

  useEffect(() => {
    if (!!delete_success) {
      setForDelete(false);
      setModalData(undefined);
      toast.success(`Product type deleted successfully!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    }

    if (delete_error) {
      for_delete(false);
      setModalData(undefined);
      toast.error(`An error occurred. Please try again.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    }
  }, [delete_success, delete_error, for_delete]);

  const handleSearch = () => {
    setParams({});
    const data = { ...params } || [];
    data['search'] = search;

    setParams(data);
  };

  const handleSearchByStatus = (value) => {
    if (params?.length > 0) {
      const d = { ...params } || [];

      d['status'] = value;
      setParams(d);
    }
    setParams({ status: value });

    const f_status = {
      0: 'Inactive',
      1: 'Active',
      2: 'All'
    };

    setFilterStatus(f_status[value]);
  };
  const onClickDelete = (data) => {
    setForDelete(data);
    setDeleteModal(true);
  };
  const handleDeleteProduct = async () => {
    if (for_delete) {
      setDeleteModal(false);

      await deleteProductType(for_delete.id);
    }
  };
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        render: (item) => {
          return item.id;
        }
      },
      {
        Header: 'Name',
        render: (item) => (
          <h5 className="fs-14 mb-1">
            <Link
              className="text-dark"
              state={{
                data: item
              }}
              onClick={() => {
                setModalData(item);
                setModalType(MODAL_TYPE.UPDATE);
                setTimeout(() => {
                  setShowAddModal(true);
                }, 200);
              }}
            >
              {' '}
              {item.name}
            </Link>
          </h5>
        )
      },
      {
        Header: 'Vendor',
        attribute: 'vendor'
      },
      {
        Header: 'Stock',
        render: (item) =>
          Intl.NumberFormat('en-US', { type: 'decimal' }).format(item.quantity)
      },
      {
        Header: 'Status',
        render: (item) => (
          <span className={`badge bg-${item.status ? 'success' : 'danger'}`}>
            {item.status ? 'Active' : 'Inactive'}
          </span>
        )
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
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  tag={Link}
                  onClick={() => {
                    setModalData(cellProps);
                    setModalType(MODAL_TYPE.UPDATE);
                    setTimeout(() => {
                      setShowAddModal(true);
                    }, 200);
                  }}
                >
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{' '}
                  Edit
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const data = cellProps;
                    onClickDelete(data);
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
    <div className="page-content list-items pb-0">
      <Container fluid>
        <BreadCrumb title="Brand Maintenance" pageTitle="BrandMaintenance" />
        <div className="card card-list">
          <div className="card-header border-0">
            <div className="row g-4">
              <div className="col-sm-auto">
                <div>
                  <Button
                    onClick={() => {
                      setModalType(MODAL_TYPE.CREATE);
                      setShowAddModal(true);
                    }}
                    className="btn btn-success"
                  >
                    <i className="ri-add-line align-bottom me-1"></i> New Brand
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
                        placeholder="Search Brand..."
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
                </div>
              </div>
              <div className="col-sm-auto">
                <ButtonGroup className="material-shadow">
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
              {isLoading || isFetching ? (
                <div className="py-4 text-center">
                  <Spinner color="primary text-center">Loading...</Spinner>
                </div>
              ) : vendor_list && vendor_list.length > 0 ? (
                <>
                  <BTable columns={columns} data={vendor_list || []} />
                </>
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
      </Container>
      <AddModal
        type={modal_type}
        show={add_show_modal}
        data={modal_data}
        setShowModal={() => setShowAddModal(false)}
      />
      <DeleteModal
        show={delete_modal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
};

export default ProductTypeList;
