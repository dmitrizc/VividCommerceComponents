import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import ProductTableInDashboard from 'ProductTableInDashboard';

import './ProductTableInDashboardConnected.scss';
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.seller_id !== this.props.seller_id
      || prevProps.count !== this.props.count
      || prevProps.start_time !== this.props.start_time
      || prevProps.end_time !== this.props.end_time
    ) {
      this.setState({
        data: [],

        isFetchingData: false,
      }, () => {
        this.fetchData();
      });
    }
  }

  fetchData = () => {
    const {
      fetchResource,
      seller_id,
      start_time,
      end_time,
      count,
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

      query.count = count || pageSize;
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

  render() {
    const {
      children,
      ...props,
    } = this.props;

    const {
      data,

      isFetchingData,
    } = this.state;

    return (
      <div className="product-summary-table--dashboard-connected">
        <ProductTableInDashboard data={data} sorted={[]} onSortedChange={null} {...props} />

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
  count: PropTypes.number,
  start_time: PropTypes.any,
  end_time: PropTypes.any,
};

export default ProductSummaryTableConnected;
