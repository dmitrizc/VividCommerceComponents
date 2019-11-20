import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import { Manager, Reference, Popper } from 'react-popper';
import PerfectScrollbar from 'react-perfect-scrollbar';

import './DropdownSelect.scss';

const DropdownArrowIcon = (props) => (
  <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M0.741223 0L10.2588 0C10.9178 0 11.2479 0.766375 10.7819 1.21457L6.02307 5.79162C5.73421 6.06946 5.26581 6.06946 4.97694 5.79162L0.218158 1.21457C-0.247875 0.766375 0.0821943 0 0.741223 0Z"
      fill="#1E135F"
    />
  </svg>
);

class DropdownSelect extends React.Component {
  state = {
    isDropdownOpen: false,
  };

  wrapperRef = null;
  popperRef = null;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  toggleDropdown = (isDropdownOpen) => this.setState(prevState => ({
    isDropdownOpen: (isDropdownOpen == null) ? !prevState.isDropdownOpen : !!isDropdownOpen,
  }));

  handleClickOutside = (event) => {
    if (
      this.state.isDropdownOpen
      && this.wrapperRef && !this.wrapperRef.contains(event.target)
      && this.popperRef && !this.popperRef.contains(event.target)
    ) {
      this.toggleDropdown(false);
    }
  };

  handleClickInput = () => {
    const {
      readOnly,
      disabled,
    } = this.props;

    if (!readOnly && !disabled) {
      this.toggleDropdown();
    }
  };

  handleClickItem = (item) => {
    if (this.props.onChange) {
      this.props.onChange((item && item.value) || item);
      this.toggleDropdown(false);
    }
  };

  render() {
    const {
      value = '',
      options = [],
      readOnly,
      disabled,
      className,
    } = this.props;

    const {
      isDropdownOpen,
    } = this.state;

    // Get current value's label
    const currentOption = _find(options, { value });

    return (
      <div
        className={`dropdown-select ${readOnly ? 'read-only' : ''} ${disabled ? 'disabled' : ''} ${className || ''}`}
        ref={ref => { this.wrapperRef = ref; }}
      >
        <DropdownArrowIcon className="dropdown-select-arrow-icon" />

        <Manager>
          <Reference>
            {({ ref }) => (
              <input
                className="dropdown-select-input"
                readOnly
                value={(currentOption && currentOption.label) || value}
                onClick={this.handleClickInput}
                ref={ref}
              />
            )}
          </Reference>

          {isDropdownOpen && ReactDOM.createPortal(
            <Popper
              placement="bottom-end"
              positionFixed={false}
              modifiers={{
                flip: { enabled: true },
                offset: { enabled: true, offset: '0,2px' },
                shift: { enabled: false },
                preventOverflow: { enabled: false },
                computeStyle: { gpuAcceleration: false },
              }}
            >
              {({ placement, ref, style, scheduleUpdate }) => (
                <div
                  className={`dropdown-select-dropdown-wrapper ${className || ''}`}
                  ref={e => {
                    ref(e);
                    this.popperRef = e;
                    window.zScheduleUpdate = scheduleUpdate;
                  }}
                  style={{
                    ...style,
                    width: (this.wrapperRef && this.wrapperRef.offsetWidth) || 100
                  }}
                  data-placeholder={placement}
                >
                  <div className="dropdown-select-dropdown-inner-wrapper">
                    <PerfectScrollbar>
                      {options.map((val, key) => (
                        <button
                          className={`dropdown-select-dropdown-item ${(currentOption && (currentOption.value === val.value)) ? 'active' : ''}`}
                          key={key}
                          onClick={e => {
                            e.preventDefault();
                            this.handleClickItem(val);
                          }}
                        >
                          <span className="dropdown-select-dropdown-item__label">
                            {(val && (val.label || val.value)) || String(val) || ''}
                          </span>
                        </button>
                      ))}
                    </PerfectScrollbar>
                  </div>
                </div>
              )}
            </Popper>
            , document.querySelector('.main-content'))}
        </Manager>
      </div>
    );
  }
}

DropdownSelect.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default DropdownSelect;
