import { useState } from 'react';
import {
  ButtonGroup,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row
} from 'reactstrap';

const BPagination = ({
  data = {},
  onPageChange,
  onPerPageChange,
  ...props
}) => {
  const { links = [], last_page, per_page, current_page } = data;

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const handlePerPageChange = (e) => {
    const { value } = e.target;

    onPerPageChange(value);
  };

  const handlePrevOnClick = () => {
    onPageChange(current_page - 1);
  };

  const handleNextOnClick = () => {
    onPageChange(current_page + 1);
  };

  const handleLastPageOnClick = () => {
    onPageChange(last_page);
  };

  const handleFirstPageOnClick = () => {
    onPageChange(1);
  };

  return (
    <div className="overflow-auto">
      <div className="d-flex flex-row justify-content-start align-items-center">
        <div className="p-0">
          <div className="d-flex flex-row justify-content-start align-items-center text-muted">
            <span>Per page</span>
            <div className="ps-3">
              <select
                className="form-select form-select-sm"
                onChange={handlePerPageChange}
                value={per_page}
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-start align-items-center ps-3">
          <Pagination
            aria-label="Page navigation example"
            className="m-0"
            listClassName="m-0"
          >
            <PaginationItem disabled={current_page === 1}>
              <PaginationLink first href="#" onClick={handleFirstPageOnClick} />
            </PaginationItem>
            <PaginationItem disabled={current_page === 1}>
              <PaginationLink href="#" previous onClick={handlePrevOnClick} />
            </PaginationItem>
            {links
              .filter((l) => !!Number(l.label))
              .map((l) => (
                <PaginationItem
                  active={Number(l.label) === current_page}
                  key={l.label}
                  onClick={() => handlePageChange(Number(l.label))}
                >
                  <PaginationLink href="#">{l.label}</PaginationLink>
                </PaginationItem>
              ))}
            <PaginationItem disabled={last_page === current_page}>
              <PaginationLink href="#" next onClick={handleNextOnClick} />
            </PaginationItem>
            <PaginationItem disabled={last_page === current_page}>
              <PaginationLink href="#" last onClick={handleLastPageOnClick} />
            </PaginationItem>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default BPagination;
