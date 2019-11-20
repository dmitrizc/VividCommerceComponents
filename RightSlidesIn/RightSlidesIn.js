import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import './RightSlidesIn.scss';

export const CloseBtnIcon = props => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="btn-close" {...props}  >
    <path
      fillRule="evenodd" clipRule="evenodd" className="fill-svg"
      d="M22.8056 22.3623C19.0468 26.1211 12.9516 26.1201 9.19381 22.3623C5.43598 18.6045 5.435 12.5093 9.19381 8.75049C12.9526 4.99169 19.0478 4.99266 22.8056 8.75049C26.5634 12.5083 26.5644 18.6035 22.8056 22.3623ZM8.22153 7.77822C3.92555 12.0742 3.92409 19.0371 8.22153 23.3346C12.519 27.632 19.4819 27.6306 23.7779 23.3346C28.0739 19.0386 28.0753 12.0757 23.7779 7.77822C19.4804 3.48078 12.5175 3.48224 8.22153 7.77822ZM18.4304 12.1534L15.9997 14.5841L13.569 12.1534C13.3017 11.8861 12.8656 11.8846 12.5968 12.1534C12.3279 12.4223 12.3294 12.8583 12.5968 13.1257L15.0274 15.5564L12.5968 17.9871C12.3279 18.2559 12.3294 18.692 12.5968 18.9593C12.8641 19.2267 13.3002 19.2282 13.569 18.9593L15.9997 16.5287L18.4304 18.9593C18.6978 19.2267 19.1338 19.2282 19.4027 18.9593C19.6715 18.6905 19.67 18.2545 19.4027 17.9871L16.972 15.5564L19.4027 13.1257C19.6715 12.8569 19.67 12.4208 19.4027 12.1534C19.1353 11.8861 18.6992 11.8846 18.4304 12.1534Z"
    />
  </svg>
);

class RightSlidesIn extends React.Component {
  state = {};

  wrapperRef = null;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.props.isOpen
      && this.wrapperRef && !this.wrapperRef.contains(event.target)
    ) {
      this.handleCloseBtn();
    }
  };

  handleCloseBtn = (e) => {
    e && e.preventDefault();

    if (this.props.toggleOpen) {
      this.props.toggleOpen(false);
    }
  };

  render() {
    const {
      isOpen,
      disableCloseBtn,
      children,
    } = this.props;

    return (
      ReactDOM.createPortal(
        <div className="right-slides-in-wrapper" ref={ref => {this.wrapperRef = ref;}}>
          <div className={`right-slides-in ${isOpen ? 'open' : ''}`}>
            {/*<PerfectScrollbar>*/}
              {!disableCloseBtn &&
              <CloseBtnIcon onClick={this.handleCloseBtn} />
              }

              {children}
            {/*</PerfectScrollbar>*/}
          </div>
        </div>
        ,
        document.getElementById('main'),
      )
    );
  }
}

RightSlidesIn.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func,
  children: PropTypes.any,
  disableCloseBtn: PropTypes.bool,
};

export default RightSlidesIn;
