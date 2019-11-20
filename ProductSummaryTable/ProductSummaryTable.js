import React from 'react';
import PropTypes from 'prop-types';

import Currency from 'react-currency-formatter';
import DataTable, { SortIcon, EmptyCellIcon } from 'DataTable';
import ProductDetails from 'ProductDetails';
import HorizontalProgressBar from 'HorizontalProgressBar';
import DropdownSelect from 'DropdownSelect';

import './ProductSummaryTable.scss';

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
      minWidth: 180,
      Cell: row => {
        const {
          asin,
          marketplace_id = '',
          product: {
            image_url = '',
            item_name = '',
            asin1 = '',
          } = {},
        } = row.original;

        const isActive = this.props.selectedRow
          && this.props.selectedRow.original
          && this.props.selectedRow.original.asin
          && this.props.selectedRow.original.asin === asin;

        return <div className={`product-summary-table__details ${isActive ? 'active' : ''}`}>
          <ProductDetails
            productPhoto={image_url}
            productTitle={item_name}
            marketplaceId={marketplace_id}
            productASIN={asin1}
          />
        </div>;
      },
    },
    {
      Header: () => (
        <span>Has BuyBox<SortIcon /></span>
      ),
      id: 'is_buybox_winner',
      accessor: 'is_buybox_winner',
      sortable: true,
      width: 105,
      Cell: row => (<span className={row.value ? '' : 'text-red'}>{row.value ? 'Yes' : 'No'}</span>),
    },
    {
      Header: () => (
        <span>Stock<SortIcon /></span>
      ),
      id: 'product.quantity',
      accessor: 'product.quantity',
      sortable: true,
      width: 70,
      Cell: row => (
        <span className={row.value > 0 ? 'text-green' : 'text-red'}>
          {row.value > 0 ? row.value : <EmptyCellIcon />}
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
    {
      Header: () => (
        <span>Amz Rank<SortIcon /></span>
      ),
      id: 'amazon_offer.rank',
      accessor: 'amazon_offer.rank',
      sortable: true,
      width: 90,
      Cell: row => (
        <span>
          {row.value != null ? Math.ceil(row.value) : <EmptyCellIcon />}
        </span>
      ),
    },
    {
      Header: () => (
        <span>User Rank<SortIcon /></span>
      ),
      id: 'seller_offer.rank',
      accessor: 'seller_offer.rank',
      sortable: true,
      width: 90,
      Cell: row => (
        <span>
          {row.value != null ? Math.ceil(row.value) : <EmptyCellIcon />}
        </span>
      ),
    },
    {
      Header: () => (
        <span># Sellers<SortIcon /></span>
      ),
      id: 'seller_count',
      accessor: 'seller_count',
      sortable: true,
      width: 85,
      Cell: row => (
        <span>
          {row.value != null ? Math.ceil(row.value) : <EmptyCellIcon />}
        </span>
      ),
    },
    {
      Header: () => (
        <span>User Price<SortIcon /></span>
      ),
      id: 'seller_offer.listing_price',
      accessor: 'seller_offer.listing_price',
      sortable: true,
      minWidth: 80,
      Cell: row => (
        <span>
          {(row.value && row.value.amount)
            ? <Currency quantity={row.value.amount} currency={row.value.currency} />
            : <EmptyCellIcon />
          }
        </span>
      ),
    },
    {
      Header: () => (
        <span>Amz Price<SortIcon /></span>
      ),
      id: 'amazon_offer.listing_price',
      accessor: 'amazon_offer.listing_price',
      sortable: true,
      minWidth: 80,
      Cell: row => (
        <span>
          {(row.value && row.value.amount)
            ? <Currency quantity={row.value.amount} currency={row.value.currency} />
            : <EmptyCellIcon />
          }
        </span>
      ),
    },
    {
      Header: () => (
        <span>Lowest Price<SortIcon /></span>
      ),
      id: 'lowest_offer.listing_price',
      accessor: 'lowest_offer.listing_price',
      sortable: true,
      minWidth: 80,
      Cell: row => (
        <span>
          {(row.value && row.value.amount)
            ? <Currency quantity={row.value.amount} currency={row.value.currency} />
            : <EmptyCellIcon />
          }
        </span>
      ),
    },
    {
      Header: () => (
        <span className="full-width table-header-price-difference">
          <span className="table-header-extra-label">
            Price Difference
          </span>
          <DropdownSelect
            className="small price-difference-dropdown"
            value={this.state.priceDifference}
            options={PRICE_DIFFERENCE_OPTIONS}
            onChange={this.handlePriceDifferenceChange}
          />
        </span>
      ),
      sortable: false,
      minWidth: 140,
      Cell: row => {
        const {
          seller_offer = {},
          amazon_offer = {},
          lowest_offer = {},
        } = row.original;

        const amazonPrice = amazon_offer && amazon_offer.listing_price && amazon_offer.listing_price.amount;
        const amazonPriceCurrency = amazon_offer && amazon_offer.listing_price && amazon_offer.listing_price.currency;
        const sellerPrice = seller_offer && seller_offer.listing_price && seller_offer.listing_price.amount;
        const lowestPrice = lowest_offer && lowest_offer.listing_price && lowest_offer.listing_price.amount;

        let result;

        switch (this.state.priceDifference) {
          case 'amzVsUserPrice':
            if (amazonPrice != null && sellerPrice != null) {
              result = <Currency quantity={amazonPrice - sellerPrice} currency={amazonPriceCurrency} />;
            } else {
              result = <EmptyCellIcon />;
            }
            break;
          case 'amzVsLowestPrice':
            if (amazonPrice != null && lowestPrice != null) {
              result = <Currency quantity={amazonPrice - lowestPrice} currency={amazonPriceCurrency} />;
            } else {
              result = <EmptyCellIcon />;
            }
            break;
          default:
        }

        return (
          <span>
            {result}
          </span>
        );
      },
    },
  ];

  handlePriceDifferenceChange = (e) => {
    this.setState({
      priceDifference: e,
    });
  };

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
        className="product-summary-table"
        {...props}
      />
    );
  }
}

ProductSummaryTable.propTypes = {
  data: PropTypes.array.isRequired,
  sorted: PropTypes.array.isRequired,
  onSortedChange: PropTypes.func.isRequired,
};

export default ProductSummaryTable;
