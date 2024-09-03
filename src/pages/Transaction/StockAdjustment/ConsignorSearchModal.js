import PropTypes from 'prop-types';

import React, { useEffect, useState, useRef } from 'react';
import Switch from '../../../Components/Common/Switch';
import SimpleBar from 'simplebar-react';
import { CSSTransition } from 'react-transition-group';
import './TableAnimation.css'; // Import your CSS file for styling

import {
  Modal,
  Card,
  CardBody,
  ModalBody,
  ModalHeader,
  Button,
  Collapse,
  Col,
  Input,
  Form,
  Label,
  FormFeedback,
  Row,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const ConsignorSearchModal = ({
  show,
  selectedConsignor,
  keywords,
  data,
  handleChangeValue,
  isVisible,
  seller_type,

  onCloseClick,
  onClickSearch,
  loading
}) => {
  const [variantresults, setVariantResults] = useState({ variants: [] });

  const handleKeyDown2 = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      onClickSearch();
    }
  };

  const handleSelect = (rowData) => {
    selectedConsignor(rowData);
    onCloseClick();
  };

  const closeModal = () => {
    onCloseClick();
  };

  return (
    <Modal isOpen={show} centered={true} size="xl" toggle={closeModal}>
      <div className=" g-1  p-2 flex row">
        <h5 className="modal-title">
          <div className="modal-title bg-light p-2 flex justify space-between row g-1 modal-header">
            <Col xxl={7}>
              <Input
                type="text"
                className="form-control"
                placeholder="Search By First name,Last name or Email"
                name="name"
                id="searchinput"
                onKeyDown={handleKeyDown2}
                onChange={(e) => handleChangeValue(e.target.value)}
              />
            </Col>
            <Col xxl={3}>
              <button
                type="button"
                className="btn btn-success w-sm  ms-1"
                name="search"
                onClick={onClickSearch}
              >
                <i className=" ri-search-2-line align-bottom me-1"></i>
                Search
              </button>{' '}
              {/*           
              <button type="button" className="btn btn-info w-sm  me-2 ms-2">
                <i className=" ri-checkbox-circle-line align-bottom me-1"></i>
                Select
              </button>{' '} */}
            </Col>
            <button
              type="button"
              className="btn-close warning"
              onClick={onCloseClick}
              aria-label="Close"
            ></button>
          </div>
        </h5>
      </div>

      <div style={{ padding: '0.8rem' }}>
        <SimpleBar
          data-simplebar="auto-hide"
          style={{ maxHeight: '450px', minHeight: '450px' }}
        >
          <table className="table table-hover align-middle table-nowrap table-striped-columns  mt-1">
            <thead className="table-light bg-light  sticky-top  mt-10">
              <tr>
                <th scope="col" style={{ width: '40%' }} className="col-1">
                  Consignor's Name
                </th>
                <th scope="col" style={{ width: '20%' }}>
                  Email
                </th>

                <th scope="col" style={{ width: '5%' }}></th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id} onDoubleClick={() => handleSelect(item)}>
                  <td>
                    {item.first_name} {item.last_name}
                  </td>
                  <td>{item.email}</td>
                  <td>
                    {' '}
                    <div className="align-right">
                      <Link
                        className="link-primary"
                        onClick={(e) => handleSelect(item)}
                      >
                        <i className="ri-checkbox-circle-fill align-middle fs-24"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {loading === true && (
                <tr>
                  <td colSpan={3} align="center">
                    Loading Please wait...
                  </td>
                </tr>
              )}
              {data.length === 0 && loading === false && (
                <tr>
                  <td colSpan={3} align="center">
                    No Consignor Found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </SimpleBar>
      </div>
    </Modal>
  );
};

ConsignorSearchModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any
};

export default ConsignorSearchModal;
