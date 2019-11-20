import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import CompetitorSummaryTable from 'CompetitorSummaryTable';
import Pagination from 'Pagination';

import './CompetitorSummaryTableConnected.scss';
import imgDashLoader from 'images/dashloader.gif';

class CompetitorSummaryTableConnected extends React.Component {
  state = {
    page: 1,
    pageSize: 10,
    total: 0,

    data: [],
    sorted: [],

    isFetchingData: false,

    totalSelectionShare: 0,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.seller_id !== this.props.seller_id
      || prevProps.asin !== this.props.asin
      || prevProps.count !== this.props.count
      || prevProps.start_time !== this.props.start_time
      || prevProps.end_time !== this.props.end_time
    ) {
      this.setState({
        data: [],
        sorted: [],

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
      asin,
      count,
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

      if (asin) {
        query.asin = asin;
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
          let totalSelectionShare = 0;
          for (let summary of res.competitor_summaries) {
            totalSelectionShare += summary.selection_share;
          }

          this.setState({
            data: res.competitor_summaries,
            page: res.paging.page,
            total: res.paging.total,
            pageSize: res.paging.count,
            isFetchingData: false,
            totalSelectionShare,
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
      noPagination,
      noSort,
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

      totalSelectionShare,
    } = this.state;

    const totalPages = Math.ceil(total / pageSize);

    return (
      <div className="competitor-summary-table-connected">
        {!noPagination &&
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
        }

        <CompetitorSummaryTable
          data={data}
          sorted={sorted}
          onSortedChange={this.handleSortedChange}
          totalSelectionShare={totalSelectionShare}
          noSort={noSort}
          selectedRow={selectedRow}
          {...props}
        />

        {isFetchingData && <div className="loading-indicator">
          <img src={imgDashLoader} alt="Loading" />
        </div>}
      </div>
    );
  }
}

CompetitorSummaryTableConnected.propTypes = {
  fetchResource: PropTypes.func.isRequired,
  seller_id: PropTypes.string,
  asin: PropTypes.string,
  noPagination: PropTypes.bool,
  noSort: PropTypes.bool,
  count: PropTypes.number,
  start_time: PropTypes.any,
  end_time: PropTypes.any,
  selectedRow: PropTypes.any,
};

export default CompetitorSummaryTableConnected;
