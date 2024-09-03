import React from 'react';
import { Spinner } from 'reactstrap';
import SimpleBar from 'simplebar-react';

/**
 *  To be added props :
 *  divClass
 *  tableClass
 *  theadClass
 **/

const BTable = ({ data, columns, style, loading = false }) => {
  const scrollStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxSizing: 'border-box',
    direction: 'inherit',
    overflow: 'auto',
    height: '100%',
    // minheight: '650px',
    scrollbarWidth: 'thin'
  };
  const TableHeader = {
    top: '0px'
  };
  return (
    <SimpleBar data-simplebar="auto-hide" style={{ ...scrollStyle, ...style }}>
      <table className="table align-middle table-nowrap sticky-header  ">
        <thead
          className="table-light bg-light sticky-top mt-60"
          style={TableHeader}
        >
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className}>
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!loading &&
            data.map((row, rowIndex) => (
              <tr key={rowIndex++}>
                {columns.map((column, colIndex) => (
                  <td key={rowIndex++}>
                    {column.render ? column.render(row) : row[column.attribute]}
                  </td>
                ))}
              </tr>
            ))}
          {loading && (
            <div className="py-4 text-center w-100 flex-grow-1 position-absolute">
              <Spinner color="primary text-center">Loading...</Spinner>
            </div>
          )}
        </tbody>
      </table>
    </SimpleBar>
  );
};

export default BTable;
