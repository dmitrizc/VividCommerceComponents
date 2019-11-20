import React from 'react';
import PropTypes from 'prop-types';

import './Pagination.scss';

const PrevButtonIcon = props => (
  <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      className="fill-svg"
      d="M0.174662 5.07252L5.01474 0.177077C5.24817 -0.0590258 5.62662 -0.0590258 5.86003 0.177077L6.42454 0.748052C6.65757 0.983752 6.65802 1.36575 6.42554 1.60201L2.58969 5.50001L6.42554 9.39799C6.65802 9.63425 6.65757 10.0162 6.42454 10.2519L5.86003 10.8229C5.6266 11.059 5.24814 11.059 5.01474 10.8229L0.174686 5.92748C-0.0587449 5.6914 -0.0587454 5.30862 0.174662 5.07252Z"
    />
  </svg>
);

const NextButtonIcon = props => (
  <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      className="fill-svg"
      d="M7.02456 5.92748L2.18448 10.8229C1.95105 11.059 1.5726 11.059 1.33919 10.8229L0.774677 10.2519C0.541644 10.0162 0.541196 9.63425 0.773681 9.39799L4.60953 5.49999L0.773681 1.60201C0.541196 1.36575 0.541644 0.983752 0.774677 0.748052L1.33919 0.177077C1.57262 -0.0590258 1.95107 -0.0590258 2.18448 0.177077L7.02453 5.07252C7.25796 5.3086 7.25796 5.69138 7.02456 5.92748Z"
    />
  </svg>
);

class Pagination extends React.Component {
  state = {};

  wrapperRef = null;

  handleChangePage = (page) => {
    const {
      readOnly,
      disabled,
      onChange,
    } = this.props;

    if (onChange && !readOnly && !disabled) {
      onChange(page);
    }
  };

  render() {
    const {
      total,
      value,
      disabled,
      readOnly,
    } = this.props;

    const pageDots = [];

    for (let i = 1; i <= total; i++) {
      pageDots.push(
        <button
          className={`pagination-select__page-dot ${i === value ? 'active' : ''}`} key={`pagedot-${i}`}
          disabled={readOnly || disabled}
          onClick={e => {
            e.preventDefault();
            this.handleChangePage(i);
          }}
        />,
      );
    }

    return (
      <div className="pagination-select" ref={ref => { this.wrapperRef = ref; }}>
        <button
          className={`pagination-select__prev-btn ${(value === 1 || disabled) ? 'disabled' : ''}`}
          disabled={value === 1 || disabled || readOnly}
          onClick={e => {
            e.preventDefault();
            this.handleChangePage(value > 1 ? (value - 1) : 1);
          }}
        >
          <PrevButtonIcon />
        </button>

        <div className={`pagination-select__page-dots ${disabled ? 'disabled' : ''}`}>
          {pageDots}
        </div>

        <button
          className={`pagination-select__next-btn ${(value === total || disabled) ? 'disabled' : ''}`}
          disabled={value === total || disabled || readOnly}
          onClick={e => {
            e.preventDefault();
            this.handleChangePage(value < total ? (value + 1) : total);
          }}
        >
          <NextButtonIcon />
        </button>
      </div>
    );
  }
}

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Pagination;