import React, { useEffect, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { useFormik } from 'formik';
import BModal from '../../../Components/Common/Modal';
import { ButtonGroup, Col, ModalFooter, Row } from 'reactstrap';
import Alerts from '../../../Components/Common/Alerts';

import { numberWithCommas } from '../../../common/helpers';

const SaveConfirmationModal = ({
  show,
  setShowModal,
  onSubmit,
  onSavePending,
  data = [],
  ...props
}) => {
  const handleOnCancel = () => {
    setShowModal(false);
  };

  return (
    <BModal
      size="lg"
      show={show}
      title="Confirmation"
      onCloseClick={handleOnCancel}
      id="SaveConfirmationModal"
    >
      <div>
        <div className="mb-3">
          <Alerts
            msg="You are trying to complete the stocktake with items not counted yet. It is recommended to complete the physical count first."
            color="danger"
            icon="ri-error-warning-line"
            dismissable={false}
          />
        </div>
        <Row className="mb-3">
          <SimpleBar style={{ maxHeight: '300px' }}>
            <Col lg={12}>
              <table className="table align-middle table-nowrap table-striped-columns">
                <thead className="table-light bg-light sticky-top">
                  <tr>
                    <th scope="col" style={{ width: '23 %' }}>
                      Product Title
                    </th>
                    <th scope="col" style={{ width: '1%' }}>
                      SKU
                    </th>
                    <th
                      scope="col"
                      style={{ width: '1%' }}
                      className="text-center"
                    >
                      Quantity on Hand
                    </th>
                    <th scope="col">Variances</th>
                    <th scope="col">Physical Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 &&
                    data.map((row, rowIndex) => {
                      let variance = '';

                      if (
                        row.stock_take_quantity - row?.quantity !== 0 &&
                        row.stock_take_quantity > 0
                      ) {
                        variance = row.stock_take_quantity - row?.quantity;
                      } else if (row.stock_take_quantity !== 0) {
                        variance =
                          row.stock_take_quantity !== '' &&
                          +row?.quantity - row.stock_take_quantity;
                      }

                      if (!!variance) {
                        variance = numberWithCommas(variance);
                      }

                      return (
                        <tr
                          key={rowIndex}
                          id={`tr_row_${rowIndex}`}
                          className="searchable"
                        >
                          <td className="col-1">{row.title}</td>
                          <td className="col-1">{row?.generic_sku}</td>
                          <td className="col-1 text-center">
                            {numberWithCommas(row?.quantity || 0)}
                          </td>

                          <td className="col-1">
                            {row.stock_take_quantity - row?.quantity !== 0 &&
                            row.stock_take_quantity > 0 ? (
                              <span
                                className={
                                  row.stock_take_quantity - row?.quantity >= 0
                                    ? 'badge bg-secondary-subtle fs-14 text-secondary'
                                    : 'badge bg-danger-subtle fs-14 text-danger'
                                }
                              >
                                {variance}
                              </span>
                            ) : row.stock_take_quantity !== 0 ? (
                              <span className="badge bg-success-subtle fs-14 text-success">
                                {variance}
                              </span>
                            ) : (
                              ''
                            )}
                          </td>
                          <td className="col-1">{row.stock_take_quantity}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Col>{' '}
          </SimpleBar>
        </Row>

        <ModalFooter className="p-0">
          <div className="hstack gap-2 flex-row justify-content-end w-100">
            <button
              type="submit"
              className="btn btn-danger align-self-start"
              onClick={onSubmit}
            >
              Force Complete
            </button>
            <div className=" flex-grow-1" />
            <button
              type="submit"
              className="btn btn-success"
              onClick={onSavePending}
            >
              Save as Pending
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={handleOnCancel}
            >
              Cancel
            </button>
          </div>
        </ModalFooter>
      </div>
    </BModal>
  );
};

export default SaveConfirmationModal;
