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
  Label,
  ButtonGroup
} from 'reactstrap';
import { Link } from 'react-router-dom';

import BreadCrumb from '../../../Components/Common/BreadCrumb';

import { DEFAULT_PER_PAGE } from '../../../common/constants';
import BPagination from '../../../Components/Common/BPagination';
import DateRangePicker from '../../../Components/Common/DateRangePicker';
import MsgToast from '../../../Components/Common/MsgToast';
import DeleteModal from '../../../Components/Common/DeleteModal';
import BTable from '../../../Components/Common/BTable';
import { useSellertypeQuery } from '../../../services/seller_type';

import { toast } from 'react-toastify';

import { useDeleteMutation } from '../../../services/stocktake';
import { useAsyncDebounce } from 'react-table';
import { useListQuery } from '../../../services/stocktake';
import {
  SELLER_TYPE,
  SELLER_TYPE_LABEL,
  STOCK_QUANTITY_OPTIONS
} from '../../../common/constants/options';
import PreCreateModal from './PreCreateModal';
import {
  useLocationListAsOptionsQuery,
  useLocationListQuery
} from '../../../services/location';
import { getLocationById } from '../../../common/helpers/product';

const StockTake = (props) => {
  const [seller_type, setSellerType] = useState({
    label: 'All',
    value: 3
  });
  const [keywords, setKeywords] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(2);
  const [params, setParams] = useState({ status: 2 });
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(DEFAULT_PER_PAGE);
  const { data, isLoading, isFetching } = useListQuery({
    ...params,
    keywords,
    page,
    per_page,
    status
  });
  const { data: locations, isLoading: loading_location } = useLocationListQuery(
    {
      per_page: 1000
    }
  );
  const { data: seller_type_list } = useSellertypeQuery();

  const location_options = locations?.data || [];

  const [stocktakeDelete] = useDeleteMutation();
  const [filter_status, setFilterStatus] = useState('All');

  const [show_modal, setShowModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isProductDelete, setIsProductDelete] = useState(false);

  const [payload, setPayload] = useState({
    name: '',
    status: 1,
    reference: '',
    track_inventory: 1
  });
  const handleFilterBySellerType = (obj) => {
    setSellerType(obj);
    setParams({ ...params, seller_type: obj.value });
  };
  const handleSearch = () => {
    if (selectedDates.length === 2) {
      const a = transformDate(selectedDates[0]);
      const b = transformDate(selectedDates[1]);
      if (status < 2) {
        setParams({
          keywords: search,
          startdate: a,
          enddate: b,
          daterange: 'true',
          status: status
        });
      } else {
        setParams({
          keywords: search,
          startdate: a,
          enddate: b,
          daterange: 'true'
        });
      }
    } else if (search) {
      setParams({ keywords: search });
    } else setParams({});
  };
  const handleTransactionDateChange = (selectedDates) => {
    setSelectedDates(selectedDates);
  };
  const transformDate = (input) => {
    const inputDate = new Date(input);

    const year = inputDate.getFullYear();
    const month = ('0' + (inputDate.getMonth() + 1)).slice(-2);
    const day = ('0' + inputDate.getDate()).slice(-2);

    const formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
  };
  const handleSearchByStatus = (value) => {
    if (Object.keys(params).length > 0) {
      const data = { ...params } || [];
      data['status'] = value;
      setStatus(value);
      setParams(data);
    }
    if (status < 2) {
      setParams({ ...params, status: value });
    } else {
      setParams({ ...params, status: null });
    }

    const f_status = {
      0: 'Completed',
      1: 'Pending',
      2: 'All'
    };

    setFilterStatus(f_status[value]);
  };

  const options = { year: 'numeric', month: 'short', day: 'numeric' };

  const columns = [
    {
      Header: 'Transaction No.',
      className: 'col-1 me-2',
      attribute: 'name',
      render: (row) => (
        <h5 className="fs-14 mb-1">
          <Link
            className="text-dark"
            to={`${row.id}/edit`}
            onClick={() => {
              handleUpdate(row);
            }}
          >
            {row.transaction_no}
          </Link>
        </h5>
      )
    },

    {
      Header: 'Transaction Date',
      className: 'col-1',
      render: (row) => (
        <span>
          {row.status === 0 &&
            new Date(row.transaction_date).toLocaleDateString('en-US', options)}
          {row.status === 1 && new Date().toLocaleDateString('en-US', options)}
        </span>
      )
    },
    {
      Header: 'Location',
      className: 'col-1',
      render: (row) => {
        const location = getLocationById(row.location, location_options);
        return <span>{location?.name || ''}</span>;
      }
    },
    {
      Header: 'Category',
      className: 'col-1',
      render: (row) => (
        <span>
          {row.category > 0 && row.category_details.name}
          {row.category === 0 && 'All'}
        </span>
      )
    },
    {
      Header: 'Created By',
      className: 'col-1',
      render: (row) => (
        <span>
          <span>
            {(row?.user?.first_name || '') + ' ' + (row?.user?.last_name || '')}
          </span>
        </span>
      )
    },
    {
      Header: 'Remarks',
      className: 'col-1',
      render: (row) => <span>{row.remarks}</span>
    },
    {
      Header: 'Status',
      className: 'col-1',
      attribute: 'status',
      render: (row) => (
        <span
          className={row.status === 0 ? 'badge bg-success' : 'badge bg-info'}
        >
          {row.status === 0 ? 'Completed' : 'Pending'}
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
              tag={Link}
              to={`${row.id}/edit`}
              onClick={() => {
                handleUpdate(row);
              }}
            >
              <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{' '}
              Edit
            </DropdownItem>

            {row.status === 1 && (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    }
  ];

  const [alert, setAlert] = useState([
    { success: false, failure: false, message: '', isEdit: false }
  ]);

  const stock_adjustment_list = data?.data || [];
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
      setIsProductDelete(false);
      let response = await stocktakeDelete(payload);
      setDeleteModal(false);
      if (response.data) {
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
        setShowModal(false);
      }
    }
  };

  document.title = 'Stocktake';

  return (
    <div className="page-content list-items">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteItem}
        onCloseClick={() => setDeleteModal(false)}
      />
      <PreCreateModal show={show_modal} setShowModal={setShowModal} />
      <Container fluid>
        <BreadCrumb title="Stocktake" pageTitle="Stocktake" />
        {alert.success === true ? (
          <MsgToast
            msg={alert.message}
            color="success"
            icon="ri-checkbox-circle-line"
          />
        ) : null}
        <Row>
          <div className="col-xl-12">
            <div>
              <div className="card">
                <div className="card-header border-0">
                  <div className="row g-4">
                    <div className="col-sm-auto">
                      <div>
                        <Link
                          to=""
                          onClick={() => setShowModal(true)}
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i>New
                        </Link>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="d-flex justify-content-sm-end">
                        <div className="col-12 col-sm-12 col-lg-4 col-md-4 col-xl-3 me-2">
                          <div className="search-box ">
                            <DateRangePicker
                              placeholder="Select Transaction Date range"
                              onChange={handleTransactionDateChange}
                            />
                            <i className="ri-calendar-line search-icon"></i>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-lg-4 col-xl-3">
                          <div className="search-box ">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search by Transaction or Remarks"
                              onChange={onChange}
                              value={search}
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
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
                        <div className="d-flex flex-wrap align-items-center gap-2 ms-2">
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
                                    handleSearchByStatus(0);
                                  }}
                                >
                                  Completed
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => {
                                    handleSearchByStatus(1);
                                  }}
                                >
                                  Pending
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
                        <div className="col-sm-auto ps-2">
                          <ButtonGroup className="material-shadow w-100">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                tag="button"
                                className="btn btn-light material-shadow-none"
                              >
                                {seller_type?.label || 'All'}{' '}
                                <i className="mdi mdi-chevron-down"></i>
                              </DropdownToggle>
                              <DropdownMenu className="notify-item language py-2">
                                {STOCK_QUANTITY_OPTIONS.map((o, i) => {
                                  if (o.type === 'divider')
                                    return (
                                      <DropdownItem
                                        key={`divider_${i}`}
                                        divider
                                      />
                                    );
                                  return (
                                    <DropdownItem
                                      key={o.value}
                                      onClick={() =>
                                        handleFilterBySellerType(o)
                                      }
                                      className={`${
                                        seller_type?.value === o.value
                                          ? 'active'
                                          : 'none'
                                      }`}
                                    >
                                      <span className="align-middle">
                                        {o.label}
                                      </span>
                                    </DropdownItem>
                                  );
                                })}
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </ButtonGroup>
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
                    {isLoading || isFetching ? (
                      <div className="py-4 text-center">
                        <Spinner color="primary text-center">
                          Loading...
                        </Spinner>
                      </div>
                    ) : stock_adjustment_list &&
                      stock_adjustment_list.length > 0 ? (
                      <div>
                        <BTable
                          data={stock_adjustment_list}
                          columns={columns}
                        />
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
                <div className="card-footer">
                  <BPagination
                    data={stock_adjustment_list}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default StockTake;