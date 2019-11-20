import React from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippy.js/react';

import './HistoryCalendarDot.scss';

export const HISTORY_CALENDAR_DOT_STATUS = {
  DISABLED: 'disabled',
  ACTIVE: 'active',
  PASSIVE: 'passive',
  TODAY: 'today',
};

class HistoryCalendarDot extends React.Component {
  state = {};

  render() {
    const {
      status,
      label,
    } = this.props;

    return (
      <div className="history-calendar-dot">
        <Tippy
          content={label}
          distance={5}
          theme="calendar-dot"
          popperOptions={{ modifiers: { computeStyle: { gpuAcceleration: false } } }}
        >
          <span className={`history-calendar-dot__circle ${status}`} />
        </Tippy>
      </div>
    );
  }
}

HistoryCalendarDot.propTypes = {
  label: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default HistoryCalendarDot;
