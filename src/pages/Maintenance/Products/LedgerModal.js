import React, { useEffect, useMemo, useRef, useState } from 'react';
import BModal from '../../../Components/Common/Modal';
import BTable from '../../../Components/Common/BTable';
import { useListQuery, useLazyListQuery } from '../../../services/transaction';
import * as moment from 'moment';

import './scss/modal.scss';
import SizeBadge from '../../../Components/Common/SizeBadge';
import ProductTitle from '../../../Components/Common/ProductTitle';
import { genericSKUBreakdown } from '../../../common/helpers/product';
import { TRANSACTION_LABEL } from '../../../common/constants/transaction';
import BPagination from '../../../Components/Common/BPagination';
import { DEFAULT_PER_PAGE } from '../../../common/constants';
import { ModalFooter } from 'reactstrap';

const LedgerModal = ({ show, setShowModal, data = {}, title, ...props }) => {
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);
  const { data: xhr_data } = useListQuery(
    {
      shopify_id: data.reference,
      page,
      per_page
    },
    { skip: !data.reference }
  );
  const list = xhr_data?.data || [];
  const addSign = (type, amount, data) => {
    if (amount === '') {
      return '';
    }
    if ([1, 3, 7].includes(type)) {
      return (
        <span className="fw-bold">
          <i className="ri-add-fill text-success " />
          {`  ` + Math.abs(amount)}
        </span>
      );
    }
    if ([2, 4, 5, 6].includes(type)) {
      if (type === 6 && data.source_location > 0) {
        return (
          <span className="fw-bold">
            <i className="ri-add-fill text-success" />
            {`  ` + Math.abs(amount)}
          </span>
        );
      }
      if (type === 6 && data.source_location === 0) {
        return (
          <span className="fw-bold">
            <i className="ri-subtract-line text-danger" />
            {`  ` + Math.abs(amount)}
          </span>
        );
      }
      return (
        <span className="fw-bold">
          <i className="ri-subtract-line text-danger" />
          {`  ` + Math.abs(amount)}
        </span>
      );
    } else {
      return Math.abs(amount);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Product',
        render: (item) => (
          <ProductTitle title={data?.title} generic_sku={item?.generic_sku} />
        )
      },
      {
        Header: 'Type',
        render: (data) => TRANSACTION_LABEL[data?.transaction_type] || ''
      },
      {
        Header: 'Size',
        render: (data) => {
          const sku_data = genericSKUBreakdown(data?.generic_sku);

          return sku_data?.size || '';
        }
      },
      {
        Header: 'Condition',
        render: (data) => data?.condition?.name || ''
      },
      {
        Header: 'Quantity',
        render: (data) =>
          addSign(data?.transaction_type, data?.quantity || '', data)
      },
      {
        Header: 'Running Bal',
        render: (data) => data?.running_bal || ''
      },
      {
        Header: 'SellerType',
        render: (data) => data?.seller_type?.name || 'UN'
      },
      {
        Header: 'Location',
        render: (data) => data?.location?.name || ''
      },
      {
        Header: 'Processed Date',
        render: (data) =>
          moment(
            moment(data?.created_at, 'YYYY-MM-DD hh:mm A').toLocaleString()
          ).format('MMM DD, YYYY hh:mm A') || ''
      }
    ],
    [data]
  );

  return (
    <BModal
      show={show}
      title="View Ledger"
      onCloseClick={() => setShowModal(false)}
      id="ViewLedger"
      classes={{
        body: 'p-0',
        container: 'ledger-modal',
        footer: 'pb-0 pt-0 justify-content-start'
      }}
      size="xl"
      scrollable
      centered
      footer={
        <BPagination
          data={xhr_data}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      }
    >
      <BTable
        columns={columns}
        data={list || []}
        style={{ marginTop: 0, height: 'calc(100% - 5rem)' }}
      />
    </BModal>
  );
};

export default LedgerModal;
