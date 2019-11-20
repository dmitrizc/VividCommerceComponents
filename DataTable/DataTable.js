import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

import './DataTable.scss';

export const SortIcon = () => (
  <svg className="sort-icon" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path className="desc" d="M0.971688 5.49994L7.02832 5.49994C7.4477 5.49994 7.65773 6.01086 7.36118 6.30966L4.33286 9.36102C4.14904 9.54625 3.85097 9.54625 3.66714 9.36102L0.638828 6.30966C0.342261 6.01086 0.552306 5.49994 0.971688 5.49994Z" fill="#a5a1bf"/>
    <path className="asc" d="M7.02831 3.99994L0.971678 3.99994C0.552295 3.99994 0.342275 3.48902 0.638817 3.19022L3.66714 0.138856C3.85096 -0.0463672 4.14903 -0.0463672 4.33286 0.138856L7.36117 3.19022C7.65774 3.48902 7.44769 3.99994 7.02831 3.99994Z" fill="#a5a1bf"/>
  </svg>
);

export const EmptyCellIcon = () => (
  <svg className="empty-cell-icon" width="19" height="4" viewBox="0 0 19 4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0 1.99994C0 0.895369 0.89543 -6.10352e-05 2 -6.10352e-05H17C18.1046 -6.10352e-05 19 0.895369 19 1.99994C19 3.10451 18.1046 3.99994 17 3.99994H2C0.89543 3.99994 0 3.10451 0 1.99994Z" fill="#D6D6DA"/>
  </svg>
);

class DataTable extends React.Component {
  state = {};

  render() {
    const {
      data,
      columns,
      sorted,
      noSort,
      onSortedChange,
      loading,
      ...props,
    } = this.props;

    return (
      <div className={`data-table ${noSort ? 'no-sort' : ''}`}>
        <ReactTable
          manual
          data={data}
          columns={columns}
          showPagination={false}
          sorted={sorted || []}
          // (newSorted, column, shiftKey) => {...}
          onSortedChange={onSortedChange}
          loading={!!loading}
          {...props}
          minWidth={200}
        />
      </div>
    );
  }
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  sorted: PropTypes.array,
  noSort: PropTypes.bool,
  onSortedChange: PropTypes.func,
  loading: PropTypes.bool,
};

export default DataTable;
