import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import { Manager, Reference, Popper } from 'react-popper';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  TextInput,
  TextInputAddon,
  SearchIcon,
} from '../TextInput';

import './DropdownSelect.scss';

class DropdownSelectWithSearch extends React.Component {
  state = {
    isDropdownOpen: false,
    searchValue: '',
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

  handleChangeSearchValue = e => {
    this.setState({
      searchValue: e.target.value,
    });
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
      width,
    } = this.props;

    const {
      isDropdownOpen,
      searchValue,
    } = this.state;

    // Get current value's label
    const currentOption = _find(options, { value });
    const current = (currentOption && currentOption.label) || value;

    return (
      <div
        className={`dropdown-select ${readOnly ? 'read-only' : ''} ${disabled ? 'disabled' : ''} ${className || ''}`}
        ref={ref => { this.wrapperRef = ref; }}
      >
        <Manager>
          <Reference>
            {({ ref }) => (
              <div
                className="text-input-wrapper dropdown-select__search full-width"
                ref={ref}
                onClick={this.handleClickInput}
              >
                {!current && (
                  <TextInputAddon><SearchIcon /></TextInputAddon>
                )}
                <TextInput
                  className={`text-input-ctrl${current ? '' : ' p-l-0'}`}
                  value={current || searchValue}
                  onChange={this.handleChangeSearchValue}
                  placeholder="Search"
                  readOnly={readOnly || current}
                  disabled={disabled}
                />
              </div>
            )}
          </Reference>

          {isDropdownOpen && ReactDOM.createPortal(
            <Popper
              placement="bottom-start"
              positionFixed={false}
              modifiers={{
                flip: { enabled: true },
                offset: { enabled: true, offset: '1px, 24px' },
                // shift: { enabled: false },
                preventOverflow: { enabled: false },
                computeStyle: { gpuAcceleration: false },
              }}
            >
              {({ placement, ref, style }) => (
                <div
                  className={`dropdown-select-dropdown-wrapper alerts-dropdown-wrapper ${className || ''}`}
                  ref={e => {
                    ref(e);
                    this.popperRef = e;
                  }}
                  style={{
                    ...style,
                    width: width || (this.wrapperRef && this.wrapperRef.offsetWidth + 14) || 100,
                  }}
                  data-placeholder={placement}
                >
                  <div className="dropdown-select-dropdown-inner-wrapper alert-search-name-items">
                    <PerfectScrollbar>
                      {options.map((val, key) => (
                        <div className="d-flex justify-content-between" key={key}>
                          <div className="dropdown-select-dropdown-item alert-search-name-item">
                            <div className="dropdown-select-dropdown-item__label">
                              {(val && (val.label || val.value)) || String(val) || ''}
                            </div>
                            <div className="dropdown-select-dropdown-item__subLabel">
                              {(val && (val.subLabel || val.value)) || String(val) || ''}
                            </div>
                          </div>

                          {/*<svg*/}
                          {/*  key={key}*/}
                          {/*  width="15"*/}
                          {/*  height="15"*/}
                          {/*  viewBox="0 0 15 15"*/}
                          {/*  fill="none"*/}
                          {/*  xmlns="http://www.w3.org/2000/svg"*/}
                          {/*  onClick={e => {*/}
                          {/*    e.preventDefault();*/}
                          {/*    this.handleClickItem(val);*/}
                          {/*  }}*/}
                          {/*>*/}
                          {/*  <path fillRule="evenodd" clipRule="evenodd" d="M7.5 14.0625C3.87563 14.0625 0.9375 11.1234 0.9375 7.5C0.9375 3.87656 3.87563 0.9375 7.5 0.9375C11.1244 0.9375 14.0625 3.87656 14.0625 7.5C14.0625 11.1234 11.1244 14.0625 7.5 14.0625ZM7.5 0C3.35766 0 0 3.35625 0 7.5C0 11.6438 3.35766 15 7.5 15C11.6423 15 15 11.6438 15 7.5C15 3.35625 11.6423 0 7.5 0ZM10.3125 7.03125H7.96875V4.6875C7.96875 4.42969 7.75922 4.21875 7.5 4.21875C7.24078 4.21875 7.03125 4.42969 7.03125 4.6875V7.03125H4.6875C4.42828 7.03125 4.21875 7.24219 4.21875 7.5C4.21875 7.75781 4.42828 7.96875 4.6875 7.96875H7.03125V10.3125C7.03125 10.5703 7.24078 10.7812 7.5 10.7812C7.75922 10.7812 7.96875 10.5703 7.96875 10.3125V7.96875H10.3125C10.5717 7.96875 10.7812 7.75781 10.7812 7.5C10.7812 7.24219 10.5717 7.03125 10.3125 7.03125Z" fill="#4B42C6"/>*/}
                          {/*</svg>*/}
                        </div>
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

DropdownSelectWithSearch.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default DropdownSelectWithSearch;
