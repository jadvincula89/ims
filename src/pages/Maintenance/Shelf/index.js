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
import TableContainer from '../../../Components/Common/TableContainer';

import MsgToast from '../../../Components/Common/MsgToast';
import DeleteModal from '../../../Components/Common/DeleteModal';
import { Link } from 'react-router-dom';
//import { useConditionsQuery } from '../../../services/maintenance';
import { useShelfQuery, useShelfdeleteMutation } from '../../../services/shelf';

import { useAsyncDebounce } from 'react-table';
import AddModal from './AddModal';

export const MODAL_TYPE = {
  CREATE: 1,
  UPDATE: 2
};

const Shelf = (props) => {
  const [keywords, setKeywords] = useState('');
  const [search, setSearch] = useState('');
  const [params, setParams] = useState({});
  const { data, isLoading, isFetching } = useShelfQuery(params);
  const [shelfdelete] = useShelfdeleteMutation();
  const [showModal, setShowModal] = useState(false);

  const [add_show_modal, setShowAddModal] = useState(false);
  const [modal_type, setModalType] = useState(MODAL_TYPE.CREATE);
  const [modal_data, setModalData] = useState(undefined);
  const [filter_status, setFilterStatus] = useState('Active');

  const [payload, setPayload] = useState({
    name: '',
    status: 1,
    location: ''
  });
  const [alert, setAlert] = useState([
    { success: false, failure: false, message: '', isEdit: false }
  ]);
  const shelf_list = data?.data || [];
  const [deleteModal, setDeleteModal] = useState(false);

  const onChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    // onChangeDebounced(value);
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
    setPayload({ ...payload, name: '', tags: '', symbol: '', status: 1 });
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
      let response = await shelfdelete(payload);
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
  const submitCreate = async (params) => {};

  const handleOnClickEdit = (e, data) => {
    e.preventDefault();
    setModalType(MODAL_TYPE.UPDATE);
    setModalData(data);
    setShowAddModal(true);
  };

  return (
    <div className="page-content list-items">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />

      <Container fluid>
        <BreadCrumb title="Shelves" pageTitle="Shelves" />
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
                        <Button
                          onClick={() => setShowAddModal(true)}
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i>Add
                          New Shelf
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
                              placeholder="Search by Shelf or Location"
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
                        <Spinner color="primary text-center">
                          Loading...
                        </Spinner>
                      </div>
                    ) : shelf_list && shelf_list.length > 0 ? (
                      <div>
                        <table className="table align-middle table-nowrap table-striped-columns mb-0">
                          <thead className="table-light">
                            <tr>
                              <th scope="col" className="col-2">
                                Shelf
                              </th>
                              <th scope="col" className="col-1">
                                Location
                              </th>
                              <th scope="col" className="col-1">
                                Stock
                              </th>
                              <th scope="col" className="col-1">
                                Status
                              </th>
                              <th scope="col" className="col-1">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {shelf_list.map((shelf) => (
                              <tr key={shelf.id}>
                                <td>
                                  <h5 className="fs-14 mb-1">
                                    <Link
                                      className="text-dark"
                                      onClick={(e) => {
                                        handleOnClickEdit(e, shelf);
                                      }}
                                    >
                                      {shelf.name}
                                    </Link>
                                  </h5>
                                </td>
                                <td>{shelf.location_name}</td>

                                <td>{'2,000'}</td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      shelf.status === 1 ? 'success' : 'danger'
                                    }`}
                                  >
                                    {shelf.status === 1 ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td>
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      href="#"
                                      className="btn-soft-secondary btn-sm"
                                      tag="button"
                                    >
                                      <i className="ri-more-fill" />
                                    </DropdownToggle>
                                    <DropdownMenu
                                      className="dropdown-menu-end"
                                      container="body"
                                    >
                                      <DropdownItem
                                        onClick={(e) =>
                                          handleOnClickEdit(e, shelf)
                                        }
                                      >
                                        <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{' '}
                                        Edit
                                      </DropdownItem>

                                      <DropdownItem divider />
                                      <DropdownItem
                                        href="#"
                                        onClick={() => {
                                          onClickDelete(shelf);
                                        }}
                                      >
                                        <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{' '}
                                        Delete
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
            </div>
          </div>
        </Row>
      </Container>
      <AddModal
        type={modal_type}
        show={add_show_modal}
        data={modal_data}
        setShowModal={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default Shelf;
