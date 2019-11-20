import React from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippy.js/react';

import DataTable, { EmptyCellIcon } from 'DataTable';

import './CompetitorTableInDashboard.scss';

class CompetitorSummaryTable extends React.Component {
  columns = [
    {
      Header: 'Seller Name',
      id: 'sellerName',
      accessor: 'competitor.seller.name',
      sortable: false,
      Cell: row => (
        <Tippy
          content={row.value}
          distance={-18}
          offset={'-4, 0'}
          placement="bottom-start"
          animation="fade"
          delay={500}
          maxWidth={500}
          boundary="window"
          theme="competitor-name"
          popperOptions={{ modifiers: { computeStyle: { gpuAcceleration: false } } }}
        >
          <span className="competitor-summary-table__seller-name">
            {row.value}
          </span>
        </Tippy>
      ),
    },
    {
      Header: () => (
        <span>Win Rate</span>
      ),
      id: 'win_rate',
      accessor: 'win_rate',
      sortable: false,
      Cell: row => (
        <span>
          {row.value > 0 ? Number.parseFloat(row.value).toFixed(2) : <EmptyCellIcon />}
        </span>
      ),
    },
    {
      Header: () => (
        <span>Selection Share</span>
      ),
      id: 'selection_share',
      accessor: 'selection_share',
      sortable: false,
      Cell: row => (
        <span>
          {row.value > 0 ? row.value : <EmptyCellIcon />}
        </span>
      ),
    },
  ];

  render() {
    const {
      data,
      sorted,
      onSortedChange,
      noSort,
    } = this.props;

    return (
      <DataTable
        data={data}
        columns={this.columns}
        sorted={sorted}
        onSortedChange={(...e) => {
          if (!noSort) {
            onSortedChange(...e);
          }
        }}
        pageSize={data.length || 0}
        noSort={noSort}
        className="competitor-summary-table--dashboard"
      />
    );
  }
}

CompetitorSummaryTable.propTypes = {
  data: PropTypes.array.isRequired,
  sorted: PropTypes.array,
  onSortedChange: PropTypes.func,
  totalSelectionShare: PropTypes.number.isRequired,
};

export default CompetitorSummaryTable;
