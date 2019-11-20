import React from 'react';
import PropTypes from 'prop-types';

import DataTable, { SortIcon, EmptyCellIcon } from 'DataTable';
import ProductDetails from 'ProductDetails';
import HorizontalProgressBar from 'HorizontalProgressBar';

import './ProductTableInDashboard.scss';

const PRICE_DIFFERENCE_OPTIONS = [
  {
    label: 'AMZ vs User Price',
    value: 'amzVsUserPrice',
  },
  {
    label: 'AMZ vs Lowest Price',
    value: 'amzVsLowestPrice',
  },
];

class ProductSummaryTable extends React.Component {
  state = {
    priceDifference: PRICE_DIFFERENCE_OPTIONS[0].value,
  };

  columns = [
    {
      Header: 'Product Name',
      id: 'productName',
      sortable: false,
      Cell: row => {
        const {
          marketplace_id = '',
          product: {
            image_url = '',
            item_name = '',
            asin1 = '',
          } = {},
        } = row.original;
        return <ProductDetails
          productPhoto={image_url}
          productTitle={item_name}
          marketplaceId={marketplace_id}
          productASIN={asin1}
        />;
      },
    },
    {
      Header: () => (
        <span>Has BuyBox</span>
      ),
      id: 'is_buybox_winner',
      accessor: 'is_buybox_winner',
      sortable: false,
      Cell: row => (<span className={row.value ? '' : 'text-red'}>{row.value ? 'Yes' : 'No'}</span>),
    },
    {
      Header: () => (
        <span>BuyBox Rate</span>
      ),
      id: 'win_rate',
      accessor: 'win_rate',
      sortable: false,
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
      ...props,
    } = this.props;

    return (
      <DataTable
        data={data}
        columns={this.columns}
        sorted={sorted}
        onSortedChange={onSortedChange}
        pageSize={data.length || 0}
        className="product-summary-table--dashboard"
        {...props}
      />
    );
  }
}

ProductSummaryTable.propTypes = {
  data: PropTypes.array.isRequired,
  sorted: PropTypes.array,
  onSortedChange: PropTypes.func,
};

export default ProductSummaryTable;
