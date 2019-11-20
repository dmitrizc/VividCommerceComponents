import React from 'react';
import PropTypes from 'prop-types';

import DataTable, { SortIcon, EmptyCellIcon } from 'DataTable';
import HorizontalProgressBar from 'HorizontalProgressBar';

import './CompetitorSummaryTable.scss';
import Tippy from '@tippy.js/react';

class CompetitorSummaryTable extends React.Component {
  columns = [
    {
      Header: 'Seller Name',
      id: 'sellerName',
      accessor: 'competitor.seller.name',
      sortable: false,
      minWidth: 180,
      Cell: row => {
        const {
          competitor_id,
        } = row.original;

        const isActive = this.props.selectedRow
          && this.props.selectedRow.original
          && this.props.selectedRow.original.competitor_id
          && this.props.selectedRow.original.competitor_id === competitor_id;

        return (
          <div className={`competitor-summary-table__name ${isActive ? 'active' : ''}`}>
            <Tippy
              content={row.value}
              distance={-19}
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
          </div>
        );
      },
    },
    {
      Header: () => (
        <span>Number of Products<SortIcon /></span>
      ),
      id: 'number_products',
      accessor: 'selection_share',
      sortable: true,
      width: 230,
      Cell: row => (
        <span className={row.value > 0 ? 'text-green' : 'text-red'}>
          {row.value > 0 ? row.value : <EmptyCellIcon />}
        </span>
      ),
    },
    {
      Header: () => (
        <span>Selection Share<SortIcon /></span>
      ),
      id: 'selection_share',
      accessor: 'selection_share',
      sortable: true,
      width: 200,
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
    {
      Header: () => (
        <span>BuyBox Winrate<SortIcon /></span>
      ),
      id: 'win_rate',
      accessor: 'win_rate',
      sortable: true,
      width: 120,
      Cell: row => (
        <HorizontalProgressBar value={row.value * 100} positive={row.value > .5} />
      ),
    },
  ];

  render() {
    const {
      data,
      sorted,
      onSortedChange,
      noSort,
      ...props,
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
        className="competitor-summary-table"
        {...props}
      />
    );
  }
}

CompetitorSummaryTable.propTypes = {
  data: PropTypes.array.isRequired,
  sorted: PropTypes.array.isRequired,
  onSortedChange: PropTypes.func.isRequired,
  noSort: PropTypes.bool,
  totalSelectionShare: PropTypes.number.isRequired,
};

export default CompetitorSummaryTable;
