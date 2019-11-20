import React from 'react';
import PropTypes from 'prop-types';

import './ToggleButton.scss';

class ToggleButton extends React.Component {
  state = {};

  handleClick = (e) => {
    e.preventDefault();

    const {
      value,
      onChange,
    } = this.props;

    if (onChange) {
      onChange(!value);
    }
  };

  render() {
    const {
      value,
      readOnly,
      disabled,
    } = this.props;

    return (
      <div
        className={`toggle-button ${value ? 'active' : ''} ${readOnly ? 'read-only' : ''} ${disabled ? 'disabled' : ''}`}
      >
        <button
          className="toggle-button-ctrl"
          disabled={readOnly || disabled}
          onClick={this.handleClick}
        >
          <span className="toggle-button-thumb" />
        </button>
      </div>
    );
  }
}

ToggleButton.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ToggleButton;
