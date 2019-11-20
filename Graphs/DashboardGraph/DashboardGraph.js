import React from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import _debounce from 'lodash/debounce';
import moment from 'moment';

import './DashboardGraph.scss';

import DataRetriver, { TimeRange, ResultSet } from 'data-retriever';
// import GraphBuilder from 'graph-builder';

import ReactHighcharts from 'react-highcharts';

import Graph from 'graph-builder/Graph';
import MainArea from 'graph-builder/Series/MainArea';
import Zoom from 'graph-builder/Themer/Zoom';

import imgDashLoader from 'images/dashloader.gif';
import AreaGradient from 'graph-builder/Themer/AreaGradient';
import HistoryTooltip from 'graph-builder/Tooltip/HistoryTooltip';

class DashboardGraph extends React.PureComponent {
  state = {
    isFetchingData: false,
    data: null,
    config: null,
  };

  wrapperRef = null;
  chartRef = null;
  graphResizeObserver = null;

  componentDidMount() {
    this.fetchData();

    const reflowDebounced = _debounce(() => {
      this.reflowGraphs();
    }, 100);

    try {
      this.graphResizeObserver = new ResizeObserver((entries, observer) => {
        reflowDebounced();
      });

      this.graphResizeObserver.observe(this.wrapperRef);
    } catch (e) {
      console.error(`Can not observe`, e);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.owner_id !== this.props.owner_id
      || prevProps.metric !== this.props.metric
      || prevProps.metric !== this.props.metric
      || prevProps.start_time !== this.props.start_time
      || prevProps.end_time !== this.props.end_time
    ) {
      this.setState({
        isFetchingData: false,
        data: null,
      });
      this.fetchData();
    }
  }

  reflowGraphs = () => {
    if (this.chartRef) {
      try {
        const chart = this.chartRef.getChart();
        chart.setSize(null, null, false);
      } catch (e) {
        console.log('can not resize graph', e);
      }
    }
  };

  fetchData = () => {
    const {
      fetchResource,
      color,
      owner_id,
      metric,
      start_time,
      end_time,
      xAxisLabel,
      yAxisLabel,
      popupTitle = '',
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
        'metric': [
          metric,
        ],
        'range': {
          'type': 'timeseries',
          'granularity': 'day',
        },
        'filters': {
          'seller_id': owner_id,
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
          const lookup = metric.substr(metric.indexOf('.') + 1);
          const current = ResultSet.extractMetric(res, lookup);
          const historical = null;

          const resultSet = new ResultSet(lookup, current, historical);

          const graph = new Graph();
          graph
            .setHeight(325)
            .addSeries(new MainArea(resultSet, { color }))
            .setTooltip(new HistoryTooltip(resultSet, ['Historical'], null, resultSet.displayName || popupTitle,))
            .setLegend({ enabled: false })
            .addThemer(new Zoom())
            .addThemer(new AreaGradient({ color }));
          graph.primaryX().settings.title = {
            text: xAxisLabel || '',
            style: { fontSize: '12px', 'color': '#1e135f', fontWeight: 'bold' },
          };
          graph.primaryY().settings.title = {
            text: yAxisLabel || '',
            style: { fontSize: '12px', 'color': '#1e135f', fontWeight: 'bold' },
          };

          const config = graph.build();
          console.log(config);

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
      <div className="buybox-dashboard-graph" ref={ref => {this.wrapperRef = ref;}}>
        {(isFetchingData || !config)
          ? (
            <div className="loading-indicator">
              <img src={imgDashLoader} alt="Loading" />
            </div>
          )
          : <ReactHighcharts config={config} ref={ref => {this.chartRef = ref;}} />
        }
      </div>
    );
  }
}

DashboardGraph.propTypes = {
  fetchResource: PropTypes.any.isRequired,
  color: PropTypes.string.isRequired,
  owner_id: PropTypes.string.isRequired,
  metric: PropTypes.string.isRequired,
  start_time: PropTypes.any,
  end_time: PropTypes.any,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  popupTitle: PropTypes.string,
};

export default DashboardGraph;
