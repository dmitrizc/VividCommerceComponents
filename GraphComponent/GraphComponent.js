import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import GraphBuilder from 'graph-builder';

import './GraphComponent.scss';

class GraphComponent extends React.Component {
  state = {
    isFetchingData: false,
  };

  fetchData = () => {
    const {
      fetchResource,
    } = this.props;

    const {
      isFetchingData,
    } = this.state;

    if (fetchResource && !isFetchingData) {
      this.setState({ isFetchingData: true });

      let query = {};

      this.props.fetchResource(query)
        .then(res => {
          this.setState({
            data: res,
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
      metric,
      timeRange,
      filters,
      width,
      height,
      color,
      ...props,
    } = this.props;

    const {
      data,
    } = this.state;

    const options = GraphBuilder.dashboardGraph(data, color);

    return (
      <div className="highchart-wrapper">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    );
  }
}

GraphComponent.propTypes = {
  metric: PropTypes.string,
  timeRange: PropTypes.array,
  filters: PropTypes.any,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  queryEndpoint: PropTypes.any,
  fetchResource: PropTypes.any,
};

export default GraphComponent;
