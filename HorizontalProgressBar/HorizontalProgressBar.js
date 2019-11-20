import React from 'react';
import PropTypes from 'prop-types';

import './HorizontalProgressBar.scss';

const HorizontalProgressBar = ({ disabled, positive = true, total = 100, value, ...props }) => {
  const percentage = value / total * 100;
  const fixedPercentage = Number(percentage.toFixed(2));

  return (
    <div
      className={`horizontal-progress-bar ${positive ? 'positive' : 'negative'} ${disabled ? 'disabled' : ''}`}
      {...props}
    >
      <div className="horizontal-progress-bar__track">
        <div
          className="horizontal-progress-bar__progress"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="horizontal-progress-bar__label">
          {fixedPercentage}%
        </span>
    </div>
  );
};

HorizontalProgressBar.propTypes = {
  disabled: PropTypes.bool,
  positive: PropTypes.bool,
  total: PropTypes.number,
  value: PropTypes.number.isRequired,
};

export default HorizontalProgressBar;
