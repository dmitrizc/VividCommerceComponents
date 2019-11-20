import React from 'react';
import PropTypes from 'prop-types';

import Pagination from 'Pagination';
import DataTable from 'DataTable';

class ProductSummaryTableConnected extends React.Component {
  state = {
    columns: [],
    data: [],
    sorted: [],

    page: -1,
    total: 0,
    pageSize: 10,

    isFetchingData: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const {
      isFetchingData,
      sorted,
      page,
    } = this.state;

    const {
      apiResource,
    } = this.props;

    if (!isFetchingData && !!apiResource) {
      this.setState({
        isFetchingData: true,
      });

      apiResource({
        page,
        sorted,
      })
        .then(res => {
          this.setState({
            isFetchingData: false,

            data: res.data,
            total: res.total,
            page: res.page,
          });
        })
        .catch(err => {
          this.setState({
            isFetchingData: false,
          });

          console.log(err);
        });
    }
  };

  onPaginationChange = (page) => {
    this.setState({
      page,
    }, () => {
      this.fetchData();
    });
  };

  onSortedChange = (newSorted, column, shiftKey) => {
    console.log('Sort Changed', {
      newSorted,
      column,
      shiftKey,
    });

    this.setState({
      sorted: newSorted,
    }, () => {
      this.fetchData();
    });
  };

  render() {
    const {
      data,
      columns,
      sorted,

      pageSize,
      page,
      total,
    } = this.state;

    return (
      <div className="data-table-connected">
        <Pagination
          total={Math.ceil(total / pageSize)}
          value={page}
          onChange={this.onPaginationChange}
        />
        <DataTable
          data={data}
          columns={columns}
          sorted={sorted}
          onSortedChange={this.onSortedChange}
        />
      </div>
    );
  }
}

ProductSummaryTableConnected.propTypes = {
  apiResource: PropTypes.func.isRequired,
};

export default ProductSummaryTableConnected;
