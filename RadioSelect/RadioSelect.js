import React from 'react';
import PropTypes from 'prop-types';

import './RadioSelect.scss';

class RadioSelect extends React.Component {
  state = {};

  wrapperRef = null;

  handleClickItem = (item) => {
    if (this.props.onChange) {
      this.props.onChange((item && item.value) || item);
    }
  };

  render() {
    const {
      value = '',
      options = [],
      readOnly,
      disabled,
    } = this.props;

    return (
      <div
        className={`radio-select ${readOnly ? 'read-only' : ''} ${disabled ? 'disabled' : ''}`}
        ref={ref => { this.wrapperRef = ref; }}
      >
        {options.map((val, key) => {
          const itemLabel = (val && (val.label || val.value)) || String(val) || '';
          const itemValue = (val && val.value) || String(val);

          return (
            <button
              key={key}
              className={`radio-select-item-btn ${itemValue === value ? 'active' : ''}`}
              disabled={readOnly || disabled}
              onClick={e => {
                e.preventDefault();
                this.handleClickItem(val);
              }}
            >
              <span>{itemLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }
}

RadioSelect.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default RadioSelect;
