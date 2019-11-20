import React from 'react';
import PropTypes from 'prop-types';

import imgDashLoader from 'images/dashloader.gif';
import { METRICS_MODE } from 'MetricsModeSelector';

import './MetricsItem.scss';
import ReactHighcharts from 'react-highcharts';

class GraphWrapper extends React.PureComponent {
  render() {
    return (
      <ReactHighcharts config={this.props.graphOption} />
    );
  }
}

const MetricsItem = ({ isFetchingData, data, color, graphOption, metric, viewMode, className = '', ...props }) => {
  return (
    <div className={`metrics-item ${className}`} {...props} style={{ borderColor: color }}>
      {isFetchingData && <div className="loading-indicator">
        <img src={imgDashLoader} alt="Loading" />
      </div>}

      {(!isFetchingData && viewMode === METRICS_MODE.CHART && graphOption) && (
        <div className="metrics-item-chart">
          <GraphWrapper graphOption={graphOption} />
          <span className="metrics-item-chart--title">{metric.shortName || ''}</span>
        </div>
      )}

      {(!isFetchingData && viewMode === METRICS_MODE.TEXT) && (
        <div className="metrics-item-text">
          <span className="metrics-item-current-value" style={{ color }}>
            {(data && data.current && data.current.latest()) || 0}
            <span className="metrics-item-current-value__unit">Current</span>
          </span>
          <span className="metrics-item-chart--title">{metric.shortName || ''}</span>
        </div>
      )}
    </div>
  );
};

MetricsItem.propTypes = {
  isFetchingData: PropTypes.bool.isRequired,
  data: PropTypes.any,
  color: PropTypes.string,
  graphOption: PropTypes.any,
  metric: PropTypes.any.isRequired,
  viewMode: PropTypes.string.isRequired,
};

export default MetricsItem;
