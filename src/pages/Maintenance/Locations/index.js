import React, { useMemo, useState } from 'react';

import {
  Button,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Spinner,
  UncontrolledDropdown,
  ButtonGroup
} from 'reactstrap';
import 'nouislider/distribute/nouislider.css';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';
import DeleteModal from '../../../Components/Common/DeleteModal';

import LocationModal from './LocationModal';
import MsgToast from '../../../Components/Common/MsgToast';

import { Link } from 'react-router-dom';
import {
  useLocationListQuery,
  useLocationCreateMutation,
  useLocationUpdateMutation,
  useLocationDeleteMutation
} from '../../../services/location';
import { useConfigurationsQuery } from '../../../services/maintenance';

import { useAsyncDebounce } from 'react-table';
import {
  SELLER_TYPE,
  SELLER_TYPE_LABEL,
  STOCK_QUANTITY_OPTIONS
} from '../../../common/constants/options';

const Locations = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const [search, setSearch] = useState(null);

  const [form, setForm] = useState({
    symbol: '',
    name: '',
    pos_id: '',
    country: '',
    state: '',
    city: '',
    building: '',
    street: '',
    status: 1
  });
  const [alert, setAlert] = useState([
    { success: false, failure: false, message: '', isEdit: false }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [filter_status, setFilterStatus] = useState('Active');
  const [params, setParams] = useState({});
  const [seller_type, setSellerType] = useState({
    label: SELLER_TYPE_LABEL.ALL,
    value: SELLER_TYPE.ALL
  });
  const { data, isLoading, isFetching } = useLocationListQuery({
    ...params,
    seller_type: seller_type.value
  });
  const items = data?.data || [];
  const handleSearch = () => {
    if (search) {
      setParams({ keywords: search });
    } else setParams({});
  };
  const onChange = (e) => {
    const value = e.target.value;
    setSearch(value);
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
    const f_stock = {
      0: 'UN',
      1: 'Non UN',
      2: 'All'
    };

    setFilterStatus(f_status[value]);
  };
  const [locationCreate, { create_data, isSuccess: create_success }] =
    useLocationCreateMutation();
  const [LocationUpdate] = useLocationUpdateMutation();
  const [locationDelete] = useLocationDeleteMutation();
  const { data: configurations } = useConfigurationsQuery({
    keywords: 'POS_ID'
  });
  const [pos_options, setOptions] = useState('');
  const onChangeDebounced = useAsyncDebounce((value) => {
    setForm(value);
  }, 1500);

  const onClickDelete = (location) => {
    setForm(location);
    setDeleteModal(true);
  };
  const populate = async () => {
    let temp = await configurations;
    temp = configurations?.data[0].value;
    temp = temp.split('|');
    setOptions(temp);
  };
  const handleAddNew = async () => {
    setForm({
      symbol: '',
      name: '',
      pos_id: '',
      country: '',
      state: '',
      city: '',
      building: '',
      reference: 0,
      street: '',
      status: 1,
      id: ''
    });
    await populate();
    setAlert({
      success: false,
      name: '',
      symbol: '',
      failure: false,
      message: '',
      isEdit: false
    });
    setShowModal(true);
  };
  const handleUpdate = async (location) => {
    setAlert({ ...alert, isEdit: true, name: '', symbol: '' });
    setForm({
      id: location.id,
      symbol: location.state_abbr,
      name: location.name,
      status: location.active,
      building: location.building,
      country: location.country,
      street: location.street,
      state: location.state,
      city: location.city,
      state_abbr: location.symbol,
      reference: location.reference,
      pos_id: location.pos_id
    });

    setShowModal(true);
    await populate();
  };
  const handleDeleteProduct = async () => {
    if (form) {
      let response = await locationDelete(form);
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
    let parameters = {
      id: form.id,
      name: form.name,
      active: form.status,
      building: form.building,
      country: form.country,
      street: form.street,
      state: form.state,
      city: form.city,
      state_abbr: form.symbol,
      reference: form.reference,
      pos_id: form.pos_id
    };
    if (alert.isEdit === false) {
      response = await locationCreate(parameters);
    } else if (alert.isEdit === true) {
      response = await LocationUpdate(parameters);
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
  /* eslint-disable */

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
              className="text-dark"
              state={{
                data: item.row.original
              }}
              onClick={() => {
                const productData = item.row.original;
                handleUpdate(productData);
              }}
            >
              {' '}
              {item.row.original.name}
            </Link>
          </h5>
        )
      },
      {
        Header: 'Abbr',
        Cell: (item) => item.row.original.state_abbr
      },
      {
        Header: 'Stock',
        Cell: (item) =>
          Intl.NumberFormat('en-US', { type: 'decimal' }).format(
            item.row.original.quantity
          )
      },
      {
        Header: 'Status',
        Cell: (item) => (
          <span
            className={`badge bg-${
              item.row.original.active ? 'success' : 'danger'
            }`}
          >
            {item.row.original.active ? 'Active' : 'Inactive'}
          </span>
        )
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
                  href="#"
                  onClick={() => {
                    const productData = cellProps.row.original;
                    handleUpdate(productData);
                  }}
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
  document.title = 'Locations';
  return (
    <div className="page-content list-items">
      <Container fluid>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteProduct}
          onCloseClick={() => setDeleteModal(false)}
        />
        <LocationModal
          show={showModal}
          alert={alert}
          handleChangeValue={setForm}
          data={form}
          options={pos_options || []}
          onClickCreate={submitCreate}
          onCloseClick={() => setShowModal(false)}
        />

        <BreadCrumb
          title="Locations Maintenance"
          pageTitle="Locations Maintenance"
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
                  <Button onClick={handleAddNew} className="btn btn-success">
                    <i className="ri-add-line align-bottom me-1"></i> New Store
                    Location
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
                        placeholder="Search by name,address"
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
              className="table-card gridjs-border-none pb-2 "
            >
              {isLoading || isFetching ? (
                <div className="py-4 text-center">
                  <Spinner color="primary text-center">Loading...</Spinner>
                </div>
              ) : items && !isFetching > 0 ? (
                <TableContainer
                  columns={columns}
                  data={items || []}
                  isGlobalFilter={false}
                  isAddUserList={false}
                  customPageSize={100}
                  divClass=" mb-1"
                  tableClass="align-middle table-nowrap mb-0 table-responsive"
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
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Locations;
