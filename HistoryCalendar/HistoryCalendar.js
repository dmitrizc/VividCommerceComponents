import React from 'react';
import PropTypes from 'prop-types';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';

import './HistoryCalendar.scss';

import HistoryCalendarDot, { HISTORY_CALENDAR_DOT_STATUS } from '../HistoryCalendarDot';

class HistoryCalendar extends React.Component {
  state = {};

  renderDay = (day) => {
    const date = day.getDate();
    const month = day.getMonth() + 1;
    const year = day.getFullYear();

    const key = `${year}-${month < 10 ? '0' : ''}${month}-${date < 10 ? '0' : ''}${date}`;

    const {
      days,
    } = this.props;

    if (DateUtils.isFutureDay(day)) {
      return <div data-date={key} />;
    }

    if (DateUtils.isSameDay(day, new Date())) {
      return (
        <div data-date={key}>
          <HistoryCalendarDot label="Today" status={HISTORY_CALENDAR_DOT_STATUS.TODAY} />
        </div>
      );
    }

    return (
      <div data-date={key}>
        <HistoryCalendarDot label={`${month}/${date}`} status={days[key] || HISTORY_CALENDAR_DOT_STATUS.DISABLED} />
      </div>
    );
  };

  renderCaption = ({ date }) => {
    return (
      <span className="DayPicker-Caption">
        {moment(date).format('MMMM')}
      </span>
    );
  };

  render() {
    const {
      date = new Date(),
    } = this.props;

    const momentToDisplay = moment(date);
    momentToDisplay.subtract(1, 'months');

    return (
      <div className="history-calendar">
        <DayPicker
          month={momentToDisplay.toDate()}
          numberOfMonths={2}
          showOutsideDays={false}
          canChangeMonth={false}
          renderDay={this.renderDay}
          captionElement={this.renderCaption}
        />
      </div>
    );
  }
}

HistoryCalendar.propTypes = {
  days: PropTypes.object.isRequired,
  date: PropTypes.any.isRequired,
};

export default HistoryCalendar;
