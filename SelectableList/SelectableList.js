import React from 'react';
import PropTypes from 'prop-types';

import './SelectableList.scss';

import {
  TextInputWrapper,
  TextInput,
  TextInputAddon,
  SearchIcon,
} from '../TextInput';

import imgRadioOn from './radio-on.svg';
import imgRadioOff from './radio-off.svg';

class SelectableList extends React.Component {
  state = {
    searchValue: '',
  };

  wrapperRef = null;

  handleChangeSearchValue = e => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  handleClickItem = (item) => {
    if (this.props.onChange) {
      const clickedItem = (item && item.value) || String(item);

      let newValue = [...this.props.value];

      if (this.props.multiSelect) {
        const index = newValue.indexOf(clickedItem);

        if (index === -1) {
          newValue.push(clickedItem);
        } else {
          newValue.splice(index, 1);
        }
      } else {
        newValue = [clickedItem];
      }

      this.props.onChange(newValue);
    }
  };

  render() {
    const {
      value = [],
      options = [],
      hasSearch = true,
      readOnly,
      disabled,
    } = this.props;

    const {
      searchValue,
    } = this.state;

    return (
      <div
        className="selectable-list"
        ref={ref => { this.wrapperRef = ref; }}
      >
        {!!hasSearch && (
          <TextInputWrapper className="selectable-list__search full-width">
            <TextInputAddon><SearchIcon /></TextInputAddon>
            <TextInput
              className="p-l-0"
              value={searchValue}
              onChange={this.handleChangeSearchValue}
              placeholder="Search"
              readOnly={readOnly}
              disabled={disabled}
            />
          </TextInputWrapper>
        )}

        <div className="selectable-list__items">
          {options.map((val, key) => {
            const itemLabel = (val && (val.label || val.value)) || String(val) || '';
            const itemValue = (val && val.value) || String(val);

            const isOptionSelected = value.indexOf(itemValue) !== -1;

            return (!searchValue || itemLabel.toLowerCase().includes(searchValue.toLowerCase()) || isOptionSelected)
              ? (
                <button
                  className={`selectable-list__item ${isOptionSelected ? 'active' : ''}`}
                  key={key}
                  onClick={e => {
                    if (!disabled && !readOnly) {
                      e.preventDefault();
                      this.handleClickItem(val);
                    }
                  }}
                >
                  <span className="selectable-list__item__title">
                    {itemLabel}
                  </span>
                  {/*<div className={`selectable-list__item__radio ${isOptionSelected ? 'active' : ''}`} />*/}
                  <img className="selectable-list__radio-img" src={isOptionSelected ? imgRadioOn : imgRadioOff} alt=""/>
                </button>
              ) : null;
          })}
        </div>
      </div>
    );
  }
}

SelectableList.propTypes = {
  value: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  hasSearch: PropTypes.bool,
  multiSelect: PropTypes.bool,
};

export default SelectableList;
