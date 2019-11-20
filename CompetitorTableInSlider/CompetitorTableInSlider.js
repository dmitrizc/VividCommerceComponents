import React from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippy.js/react';

import DataTable, { EmptyCellIcon } from 'DataTable';
import HorizontalProgressBar from 'HorizontalProgressBar';

import './CompetitorTableInSlider.scss';

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
          offset={"-4, 0"}
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
        <span>Price</span>
      ),
      id: 'price',
      accessor: 'price',
      minWidth: 76,
      sortable: false,
      Cell: row => (
        <span>
          {row.value > 0 ? `$${row.value}` : <EmptyCellIcon />}
        </span>
      ),
    },
    {
      Header: () => (
        <span>Avg Seller Rank</span>
      ),
      id: 'avg_seller_rank',
      accessor: 'avg_seller_rank',
      minWidth: 95,
      sortable: false,
      Cell: row => (
        <span>
          {row.value > 0 ? row.value : <EmptyCellIcon />}
        </span>
      ),
    },
    {
      Header: () => (
        <span>Avg Price</span>
      ),
      id: 'win_rate',
      accessor: 'win_rate',
      minWidth: 65,
      sortable: false,
      Cell: row => (
        <span className={row.value > 0 ? 'text-green' : 'text-red'}>
          {
            (row.value > 0 && this.props.totalSelectionShare !== 0)
              ? `${Number.parseFloat(row.value / this.props.totalSelectionShare * 100).toFixed(2)} %`
              : <EmptyCellIcon />
          }
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
        className="competitor-summary-table--slider"
      />
    );
  }
}

CompetitorSummaryTable.propTypes = {
  data: PropTypes.array.isRequired,
  sorted: PropTypes.array.isRequired,
  onSortedChange: PropTypes.func.isRequired,
  totalSelectionShare: PropTypes.number.isRequired,
};

export default CompetitorSummaryTable;
