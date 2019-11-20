import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import ProductSummaryTable from 'ProductSummaryTable';
import Pagination from 'Pagination';

import './ProductSummaryTableConnected.scss';
import imgDashLoader from 'images/dashloader.gif';

class ProductSummaryTableConnected extends React.Component {
  state = {
    page: 1,
    pageSize: 10,
    total: 0,

    data: [],
    sorted: [],

    isFetchingData: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const {
      fetchResource,
      seller_id,
      start_time,
      end_time,
    } = this.props;

    const {
      sorted,
      isFetchingData,
      page,
      pageSize,
    } = this.state;

    if (fetchResource && !isFetchingData) {
      this.setState({ isFetchingData: true });

      let query = {};

      query.seller_id = seller_id;
      if (sorted && sorted.length) {
        query.order_by = sorted[0].id;
        query.order_direction = sorted[0].desc ? 'DESC' : 'ASC';
      }

      if (start_time) {
        query.start_time = moment(start_time).format('YYYY-MM-DD HH:mm:ss');
      }

      if (end_time) {
        query.end_time = moment(end_time).format('YYYY-MM-DD HH:mm:ss');
      }

      query.count = pageSize;
      query.page = page;

      this.props.fetchResource(query)
        .then(res => {
          this.setState({
            data: res.product_summaries,
            page: res.paging.page,
            total: res.paging.total,
            pageSize: res.paging.count,
            isFetchingData: false,
          });
        })
        .catch(err => {
          this.setState({
            isFetchingData: false,
          });
        });
    }
  };

  handleSortedChange = (sorted) => {
    this.setState({
      sorted,
    }, () => {
      this.fetchData();
    });
  };

  handlePageChange = (page) => {
    this.setState({
      page,
    }, () => {
      this.fetchData();
    });
  };

  render() {
    const {
      children,
      selectedRow,
      ...props,
    } = this.props;

    const {
      page,
      pageSize,
      total,

      data,
      sorted,

      isFetchingData,
    } = this.state;

    const totalPages = Math.ceil(total / pageSize);

    return (
      <div className="product-summary-table-connected">
        <div className="table-top">
          {children}

          {totalPages > 1 &&
          <Pagination
            total={totalPages}
            value={Number.parseInt(page)}
            onChange={this.handlePageChange}
          />
          }
        </div>

        <ProductSummaryTable
          data={data}
          sorted={sorted}
          onSortedChange={this.handleSortedChange}
          selectedRow={selectedRow}
          {...props}
        />

        {isFetchingData && <div className="loading-indicator">
          <img src={imgDashLoader} alt="Loading"/>
        </div> }
      </div>
    );
  }
}

ProductSummaryTableConnected.propTypes = {
  fetchResource: PropTypes.func.isRequired,
  seller_id: PropTypes.string.isRequired,
  start_time: PropTypes.any,
  end_time: PropTypes.any,
  selectedRow: PropTypes.any,
};

export default ProductSummaryTableConnected;
