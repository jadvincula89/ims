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
import { toast } from 'react-toastify';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';
import ConditionModal from './ConditionModal';
import MsgToast from '../../../Components/Common/MsgToast';
import DeleteModal from '../../../Components/Common/DeleteModal';
import { Link } from 'react-router-dom';
//import { useConditionsQuery } from '../../../services/maintenance';
import {
  useConditionsQuery,
  useConditionCreateMutation,
  useConditionUpdateMutation,
  useConditionDeleteMutation
} from '../../../services/condition';

import { useAsyncDebounce } from 'react-table';
import {
  SELLER_TYPE,
  SELLER_TYPE_LABEL,
  STOCK_QUANTITY_OPTIONS
} from '../../../common/constants/options';

const Conditions = (props) => {
  const [keywords, setKeywords] = useState('');
  const [params, setParams] = useState({});
  const [search, setSearch] = useState(null);
  const [seller_type, setSellerType] = useState({
    label: SELLER_TYPE_LABEL.ALL,
    value: SELLER_TYPE.ALL
  });
  const { data, isLoading, isFetching } = useConditionsQuery({
    ...params,
    seller_type: seller_type.value
  });
  const [showModal, setShowModal] = useState(false);
  const [conditionCreate, { create_data, isSuccess: create_success }] =
    useConditionCreateMutation();
  const [conditionUpdate] = useConditionUpdateMutation();
  const [conditionDelete] = useConditionDeleteMutation();
  const [payload, setPayload] = useState({
    name: '',
    status: 1,
    symbol: '',
    tags: '',
    reference: 0
  });
  const [alert, setAlert] = useState([
    { success: false, failure: false, message: '', isEdit: false }
  ]);
  const conditions_list = data?.data || [];
  const [deleteModal, setDeleteModal] = useState(false);
  const [filter_status, setFilterStatus] = useState('Active');

  const onChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onChangeDebounced(value);
  };
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
  const handleAdd = () => {
    setAlert({ ...alert, isEdit: false });
    setPayload({
      ...payload,
      name: '',
      tags: '',
      symbol: '',
      status: 1,
      reference: 0
    });
    setShowModal(true);
  };

  const handleUpdate = async (condition) => {
    setAlert({ ...alert, isEdit: true, name: '', symbol: '' });
    let array_tags = [];
    condition.tags.split('|').forEach((element) => {
      array_tags.push({ label: element, value: element });
    });
    setPayload({
      id: condition.id,
      symbol: condition.symbol,
      name: condition.name,
      status: condition.status,
      reference: condition.reference,
      tags: array_tags
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

  const handleDeleteProduct = async () => {
    if (payload) {
      let response = await conditionDelete(payload);
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
    let tempstr = [];
    let tags = '';
    params.tags.forEach((item, index) => {
      tempstr.push(item.value.replace('|', ''));
    });
    if (tempstr.length > 0) {
      tags = tempstr.join('|');
    }
    let parameters = {
      id: params.id,
      name: params.name,
      status: params.status,
      tags: tags,
      symbol: params.symbol,
      reference: params.reference
    };
    if (alert.isEdit === false) {
      response = await conditionCreate(parameters);
    } else if (alert.isEdit === true) {
      response = await conditionUpdate(parameters);
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
        // setAlert({ ...alert, success: false, message: response.data.message });

        toast.success(response.data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      }, 3000);
    } else if (response.error.status === 404) {
      let newmessage = response.error.data.message.replace('.', '. \n');

      toast.error(newmessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    } else if (response.error.status === 'FETCH_ERROR') {
      // setAlert({
      //   ...alert,
      //   failure: true,
      //   success: false,
      //   message:
      //     'An unexpected error was encountered. Please contact your administrators'
      // });
      toast.error(
        'An unexpected error was encountered. Please contact your administrators',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        }
      );
    }
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
        Header: 'Condition',
        Cell: (item) => (
          <h5 className="fs-14 mb-1">
            <Link
              className="text-dark"
              state={{
                data: item.row.original
              }}
              onClick={() => {
                const conditiondata = item.row.original;
                handleUpdate(conditiondata);
              }}
            >
              {' '}
              {item.row.original.name}
            </Link>
          </h5>
        )
      },
      {
        Header: 'Symbol',
        accessor: 'symbol'
      },
      {
        Header: 'Tags',
        Cell: (item) => {
          const tags = item.row.original.tags.split('|');
          return (
            <div className="hstack gap-2">
              {tags.map((t, i) => (
                <span key={i + t} className="badge bg-info">
                  {t}
                </span>
              ))}
            </div>
          );
        }
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
              item.row.original.status ? 'success' : 'danger'
            }`}
          >
            {item.row.original.status ? 'Active' : 'Inactive'}
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
              <DropdownMenu className="dropdown-menu-end" container="body">
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const conditiondata = cellProps.row.original;
                    handleUpdate(conditiondata);
                  }}
                >
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{' '}
                  Edit
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const conditiondata = cellProps.row.original;
                    onClickDelete(conditiondata);
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
    []
  );

  return (
    <div className="page-content list-items">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <ConditionModal
        show={showModal}
        data={payload}
        handleChangeValue={setPayload}
        onClickCreate={submitCreate}
        alert={alert}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setShowModal(false)}
      />
      <Container fluid>
        <BreadCrumb
          title="Conditions Maintenance"
          pageTitle="Conditions Maintenance"
        />

        <div className="card card-list">
          <div className="card-header border-0">
            <div className="row g-4">
              <div className="col-sm-auto">
                <div>
                  <Button onClick={handleAdd} className="btn btn-success">
                    <i className="ri-add-line align-bottom me-1"></i> New
                    Condition
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
                        placeholder="Search By Condition, symbol or tags"
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
              className="table-card gridjs-border-none pb-2"
            >
              {isLoading || isFetching ? (
                <div className="py-4 text-center">
                  <Spinner color="primary text-center">Loading...</Spinner>
                </div>
              ) : conditions_list && conditions_list.length > 0 ? (
                <TableContainer
                  columns={columns}
                  data={conditions_list || []}
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
      </Container>
    </div>
  );
};

export default Conditions;
