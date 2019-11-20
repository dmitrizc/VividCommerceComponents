import React from 'react';
import PropTypes from 'prop-types';
import DayPicker, { DateUtils } from 'react-day-picker';
import { Manager, Reference, Popper } from 'react-popper';
import moment from 'moment';

import './DateRangePicker.scss';

class DateRangePicker extends React.Component {
  state = {
    isDayPickerOpen: false,
    dayPickerRange: {
      from: undefined,
      to: undefined,
    },
  };

  wrapperRef = null;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  toggleDayPicker = (isDayPickerOpen) => this.setState(prevState => ({
    isDayPickerOpen: (isDayPickerOpen == null) ? !prevState.isDayPickerOpen : !!isDayPickerOpen,
  }));

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleDayPicker(false);
    }
  };

  handleClickInput = () => {
    const {
      readOnly,
      disabled,
    } = this.props;

    if (!readOnly && !disabled) {
      this.toggleDayPicker();
    }
  };

  handleSelectRange = (ranges) => {
    if (this.props.onChange) {
      this.props.onChange(ranges);
      this.toggleDayPicker(false);
    }
  };

  handleDayClick = (day) => {
    if (!this.state.dayPickerRange.to) {
      const range = DateUtils.addDayToRange(day, this.state.dayPickerRange);
      this.setState({
        dayPickerRange: range,
      });
    } else {
      this.setState({
        dayPickerRange: { from: day, to: undefined },
      });
    }
  };

  render() {
    const {
      start,
      end,
      readOnly,
      disabled,
    } = this.props;

    const {
      isDayPickerOpen,
      dayPickerRange,
    } = this.state;

    const startMoment = moment(start);
    const endMoment = moment(end);

    const ranges = {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    };

    let activeSelection = '';

    for (const range in ranges) {
      if (
        ranges.hasOwnProperty(range)
        && startMoment.isSame(ranges[range][0], 'day')
        && endMoment.isSame(ranges[range][1], 'day')
      ) {
        activeSelection = range;
        break;
      }
    }

    return (
      <div className="date-range-picker" ref={ref => { this.wrapperRef = ref; }}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <input
                className="date-range-input"
                readOnly
                value={`${startMoment.format('M/D/YYYY')} - ${endMoment.format('M/D/YYYY')}`}
                onClick={this.handleClickInput}
                ref={ref}
              />
            )}
          </Reference>

          {isDayPickerOpen && (
            <Popper
              placement="bottom-end"
              positionFixed={false}
              modifiers={{
                flip: { enabled: true },
                offset: { enabled: true, offset: '0,2px' },
                computeStyle: { gpuAcceleration: false },
              }}
            >
              {({ placement, ref, style }) => (
                <div
                  className="date-range-picker__day-picker-wrapper"
                  ref={ref}
                  style={style}
                  data-placeholder={placement}
                >
                  <DayPicker
                    numberOfMonths={2}
                    pagedNavigation
                    fixedWeeks
                    selectedDays={[dayPickerRange.from, dayPickerRange]}
                    modifiers={{ start: dayPickerRange.from, end: dayPickerRange.to }}
                    onDayClick={this.handleDayClick}
                  />
                  <div className="date-range-picker__day-picker__controls">
                    <button
                      className="btn-static"
                      onClick={e => {
                        e.preventDefault();
                        this.toggleDayPicker(false);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn-static"
                      disabled={!dayPickerRange.from || !dayPickerRange.to}
                      onClick={e => {
                        e.preventDefault();
                        this.handleSelectRange([dayPickerRange.from, dayPickerRange.to]);
                      }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              )}
            </Popper>
          )}
        </Manager>

        <button
          className={`date-range-button ${activeSelection === 'Today' ? 'active' : ''}`}
          disabled={readOnly || disabled}
          onClick={e => {
            e.preventDefault();
            this.handleSelectRange(ranges['Today']);
          }}
        >
          D
        </button>
        <button
          className={`date-range-button ${activeSelection === 'Last 7 Days' ? 'active' : ''}`}
          disabled={readOnly || disabled}
          onClick={e => {
            e.preventDefault();
            this.handleSelectRange(ranges['Last 7 Days']);
          }}
        >
          W
        </button>
        <button
          className={`date-range-button ${activeSelection === 'This Month' ? 'active' : ''}`}
          disabled={readOnly || disabled}
          onClick={e => {
            e.preventDefault();
            this.handleSelectRange(ranges['This Month']);
          }}
        >
          M
        </button>
      </div>
    );
  }
}

DateRangePicker.propTypes = {
  start: PropTypes.any.isRequired,
  end: PropTypes.any.isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default DateRangePicker;