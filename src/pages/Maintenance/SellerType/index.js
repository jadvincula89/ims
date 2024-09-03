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

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import SellerTypeModal from './SellerTypeModal';

import MsgToast from '../../../Components/Common/MsgToast';
import DeleteModal from '../../../Components/Common/DeleteModal';
import BTable from '../../../Components/Common/BTable';

import {
  useSellertypeQuery,
  useDeleteMutation,
  useCreateMutation,
  useUpdateMutation
} from '../../../services/seller_type';

import { useAsyncDebounce } from 'react-table';
import { Link } from 'react-router-dom';

const SellerType = (props) => {
  const [keywords, setKeywords] = useState('');
  const [search, setSearch] = useState('');
  const [params, setParams] = useState({});
  const { data, isLoading, isFetching } = useSellertypeQuery(params);
  const [filter_stock, setFilterStock] = useState('UN');
  const [sellerDelete] = useDeleteMutation();
  const [sellerCreate] = useCreateMutation();
  const [sellerUpdate] = useUpdateMutation();
  const [showModal, setShowModal] = useState(false);
  const [filter_status, setFilterStatus] = useState('Active');

  const [payload, setPayload] = useState({
    name: '',
    status: 1,
    reference: '',
    track_inventory: 1
  });
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
  const columns = [
    {
      Header: 'Seller Type',
      className: 'col-3 me-4',
      attribute: 'name',
      render: (row) =>
        row.locked === 1 ? (
          <Link onClick={() => handleUpdate(row)}>
            <h5 className="fs-14 mb-1">
              <i className="ri-lock-fill align-bottom me-2 "></i>
              {row.name}
            </h5>
          </Link>
        ) : (
          <Link onClick={() => handleUpdate(row)}>
            <h5 className="fs-14 mb-1">
              <i className="align-bottom me-4"></i>
              {row.name}
            </h5>
          </Link>
        )
    },
    {
      Header: 'Stock',
      className: 'col-1',
      render: (row) =>
        Intl.NumberFormat('en-US', { type: 'decimal' }).format(
          row.stocks?.quantity
        )
    },

    {
      Header: 'Status',
      className: 'col-1',
      attribute: 'status',
      render: (row) => (
        <span
          className={row.status === 1 ? 'badge bg-success' : 'badge bg-danger'}
        >
          {row.status === 1 ? 'Active' : 'Not Active'}
        </span>
      )
    },
    {
      Header: 'Action',
      className: 'col-1',
      attribute: 'age',
      render: (row) => (
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
                handleUpdate(row);
              }}
            >
              <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{' '}
              Edit
            </DropdownItem>

            <DropdownItem divider />
            <DropdownItem
              href="#"
              onClick={() => {
                const productData = row;
                onClickDelete(productData);
              }}
            >
              <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{' '}
              Delete
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    }
  ];

  const [alert, setAlert] = useState([
    { success: false, failure: false, message: '', isEdit: false }
  ]);

  const seller_type_list = data?.data || [];
  const [deleteModal, setDeleteModal] = useState(false);

  const onChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onChangeDebounced(value);
  };

  const handleAdd = () => {
    setAlert({ ...alert, isEdit: false });
    setPayload({
      ...payload,
      name: '',
      status: 1,
      reference: '',
      track_inventory: 1
    });
    setShowModal(true);
  };

  const handleUpdate = async (seller_type) => {
    setAlert({ ...alert, isEdit: true, name: '', symbol: '' });

    setPayload({
      id: seller_type.id,
      reference: seller_type.reference,
      name: seller_type.name,
      track_inventory: seller_type.track_inventory,
      status: seller_type.status
    });

    setShowModal(true);
  };
  const onChangeDebounced = useAsyncDebounce((value) => {
    setKeywords(value);
  }, 1500);

  const onClickDelete = (condition) => {
    setPayload(condition);
    setDeleteModal(true);
  };

  const handleDeleteItem = async () => {
    if (payload) {
      let response = await sellerDelete(payload);
      setDeleteModal(false);
      if (response.data) {
        setAlert({
          ...alert,
          failure: false,
          success: true,
          message: response.data.message
        });
        setShowModal(false);
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
  const submitCreate = async (params) => {
    let response;

    if (alert.isEdit === false) {
      response = await sellerCreate(params);
    } else if (alert.isEdit === true) {
      response = await sellerUpdate(params);
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
      let newmessage = [response.error.data.error];
      let a,
        b = '';
      if (newmessage[0].name) {
        a = newmessage[0].name;
      }

      if (newmessage[0].state_abbr) {
        b = newmessage[0].state_abbr;
      }
      setAlert({
        ...alert,
        failure: true,
        error: newmessage,
        symbol: b,
        name: a,
        success: false,
        message: ''
      });
    } else if (response.error.status === 'FETCH_ERROR') {
      setAlert({
        ...alert,
        failure: true,
        success: false,
        error:
          'An unexpected error was encountered. Please contact your administrators'
      });
    }

    // const xhr = await sizeCreate({ ...form, visible: status.value || 0, parent_id: 0 });
  };
  document.title = 'Seller Types';

  return (
    <div className="page-content list-items">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteItem}
        onCloseClick={() => setDeleteModal(false)}
      />
      <SellerTypeModal
        show={showModal}
        alert={alert}
        handleChangeValue={setPayload}
        data={payload}
        onClickCreate={submitCreate}
        onCloseClick={() => setShowModal(false)}
      />
      <Container fluid>
        <BreadCrumb
          title="Seller Type Maintenance"
          pageTitle="Seller Type Maintenance"
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
            <div className="row g-4">
              <div className="col-sm-auto">
                <div>
                  <Button onClick={handleAdd} className="btn btn-success">
                    <i className="ri-add-line align-bottom me-1"></i>Add New
                    Seller Type
                  </Button>
                </div>
              </div>
              <div className="col-sm">
                <div className="d-flex justify-content-sm-end">
                  <div className="search-box ms-2 col-md-3">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Seller Type"
                        onChange={onChange}
                        value={search}
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
              {isLoading || isFetching ? (
                <div className="py-4 text-center">
                  <Spinner color="primary text-center">Loading...</Spinner>
                </div>
              ) : seller_type_list && seller_type_list.length > 0 ? (
                <div>
                  <BTable data={seller_type_list} columns={columns} />
                </div>
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
      </Container>
    </div>
  );
};

export default SellerType;
