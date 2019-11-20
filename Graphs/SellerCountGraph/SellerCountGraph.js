import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './SellerCountGraph.scss';

import DataRetriver, { TimeRange, ResultSet } from 'data-retriever';
// import GraphBuilder from 'graph-builder';

import ReactHighcharts from "react-highcharts";

import Graph from 'graph-builder/Graph';
import Line from 'graph-builder/Series/Line';
import Legend from 'graph-builder/Legend';
import Zoom from 'graph-builder/Themer/Zoom';

import imgDashLoader from 'images/dashloader.gif';

class SellerCountGraph extends React.PureComponent {
  state = {
    isFetchingData: false,
    data: null,
    config: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.ASIN !== this.props.ASIN
      || prevProps.owner_id !== this.props.owner_id
      || prevProps.metric !== this.props.metric
      || prevProps.start_time !== this.props.start_time
      || prevProps.end_time !== this.props.end_time
    ) {
      this.setState({
        isFetchingData: false,
        data: null,
        config: null,
      }, () => {
        this.fetchData();
      });
    }
  }

  fetchData = () => {
    const {
      fetchResource,
      color,
      owner_id,
      ASIN,
      metric,
      start_time,
      end_time,
    } = this.props;

    const {
      isFetchingData,
    } = this.state;

    if (fetchResource && !isFetchingData) {
      this.setState({ isFetchingData: true });

      // FIXME dataRetriver is not working with new timeseries api, calling api manually now.

      // const dataRetriver = new DataRetriver(fetchResource);
      // dataRetriver.query({"owner_id": owner_id})
      //   .includeMetrics(metric)
      //   // .setTimeRange(TimeRange.last2Months())
      //   .filterBy('asin', ASIN)
      //   .run()
      //   .then(res => {
      //     console.log('nice');
      //     const resultSet = data[metric];
      //     const config = GraphBuilder.dashboardGraph(resultSet, '#ccc', false).getConfig();
      //
      //     this.setState({
      //       isFetchingData: false,
      //       data: resultSet,
      //       config: config,
      //     });
      //   })
      //   .catch(err => {
      //     this.setState({
      //       isFetchingData: false,
      //     });
      //   });

      let query = {
        'owner_id': owner_id,
        'filters': {
          'asin': ASIN,
        },
        'metric': [
          metric,
        ],
        'range': {
          'type': 'timeseries',
          'granularity': 'day',
        },
      };

      if (start_time) {
        if (!query.filters.timestamp) {
          query.filters.timestamp = {};
        }

        query.filters.timestamp.start = moment(start_time).format('YYYY-MM-DD HH:mm:ss');
      }

      if (end_time) {
        if (!query.filters.timestamp) {
          query.filters.timestamp = {};
        }

        query.filters.timestamp.end = moment(end_time).format('YYYY-MM-DD HH:mm:ss');
      }

      this.props.fetchResource(query)
        .then(res => {
          const lookup = metric.split('.')[1];
          const current = ResultSet.extractMetric(res, lookup);
          const historical = null;

          const resultSet = new ResultSet(lookup, current, historical);

          const graph = new Graph();
          graph
            .setHeight(220)
            .addSeries(new Line({
              color,
              lineWidth: 2,
              name: 'No. of Offers',
              marker: {
                enabled: false,
              },
              data: resultSet.current.toSeries(),
            }))
            .setTooltip(false)
            .setLegend(new Legend({
              align: 'right',
              layout: 'horizontal',
              floating: false,
            }))
            .addThemer(new Zoom())
            .primaryX().makeInvisible();

          const config = graph.build();

          this.setState({
            isFetchingData: false,
            data: resultSet,
            config,
          });
        })
        .catch(err => {
          console.error(err);

          this.setState({
            isFetchingData: false,
          });
        });
    }

  };

  render() {
    const {
      config,
      isFetchingData,
    } = this.state;

    return (
      <div className="seller-count-graph">
        {(isFetchingData || !config)
          ? (
            <div className="loading-indicator">
              <img src={imgDashLoader} alt="Loading"/>
            </div>
          )
          : <ReactHighcharts config={config}/>
        }
      </div>
    );
  }
}

SellerCountGraph.propTypes = {
  fetchResource: PropTypes.any.isRequired,
  color: PropTypes.string.isRequired,
  owner_id: PropTypes.string.isRequired,
  ASIN: PropTypes.string.isRequired,
  metric: PropTypes.string.isRequired,
  start_time: PropTypes.any,
  end_time: PropTypes.any,
};

export default SellerCountGraph;
