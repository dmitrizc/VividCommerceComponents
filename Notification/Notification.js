import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollBar from 'react-perfect-scrollbar';

import AlertsModal from '../AlertsModal';
import {
  ALERTS_TABLE_DATA,
} from '../../pages/ComponentsGallery/constants';

import './Notification.scss';

class Notification extends React.Component {
  state = {
    isOpenModal: false,
    alerts: [],//  ALERTS_TABLE_DATA,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = ev => {
    if (
      this.modalWrapperRef
      && this.modalWrapperRef.contains(ev.target)
      && this.modalRef
      && !this.modalRef.contains(ev.target)
    ) {
      this.toggleModal();
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({
      isOpenModal: !prevState.isOpenModal,
    }));
  };

  getRef = ref => this.modalWrapperRef = ref;

  getInnerRef = ref => this.modalRef = ref;

  addAlerts = (data) => {
    const { alerts } = this.state;
    this.setState({
      alerts: [
        ...alerts,
        ...data.filter(d => d.name),
      ]
    });
  };

  deleteAlert = id => {
    const { alerts } = this.state;
    const index = alerts.findIndex(alert => alert.id === id);
    if (index > -1) {
      alerts.splice(index, 1);
      this.setState({ alerts });
    }
  };

  editAlert = id => {
    const { alerts } = this.state;
    const index = alerts.findIndex(alert => alert.id === id);
    if (index > -1) {
      alerts[index].editable = true;
      alerts[index].isMenuOpened = false;
      this.setState({ alerts });
    }
  };

  toggleMenu = id => {
    const { alerts } = this.state;
    const index = alerts.findIndex(alert => alert.id === id);
    if (index > -1) {
      alerts[index].isMenuOpened = !alerts[index].isMenuOpened;
      this.setState({ alerts });
    }
  };

  render() {
    const { isOpenModal, alerts } = this.state;
    const {
      notifications = [
        { title: 'Sample line of a alert', time: '17 mins ago' },
        { title: 'Sample line of a alert', time: '19 mins ago' },
        { title: 'Sample line of a alert', time: '21 mins ago' },
        { title: 'Sample line of a alert', time: '17 hours ago' },
        { title: 'Sample line of a alert', time: '19 hours ago' },
        { title: 'Sample line of a alert', time: '32 hours ago' },
        { title: 'Sample line of a alert', time: '1 day ago' },
      ],
    } = this.props;

    const hasNotification = notifications && notifications.length > 0;

    return (
      <Fragment>
        <a
          href="javascript:;"
          className={`header-notification${hasNotification ? ' active' : ''}`}
          onClick={this.toggleModal}
        >
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.81818 3.90912C9.31977 3.90912 11.3477 5.93705 11.3477 8.43864C11.3477 9.25959 11.1246 10.0651 10.7022 10.7691L10.4545 11.1818L10.9247 12.5923C11.0893 13.0862 11.4434 13.4945 11.9091 13.7273C12.3548 13.9502 12.6364 14.4057 12.6364 14.9041V15.1818C12.6364 15.7843 12.1479 16.2728 11.5455 16.2728H2.09091C1.48842 16.2728 1 15.7843 1 15.1818L1 14.9041C1 14.4057 1.28155 13.9502 1.72727 13.7273C2.19294 13.4945 2.54704 13.0862 2.71168 12.5923L3.18182 11.1818L2.93415 10.7691C1.64709 8.62397 2.34267 5.84166 4.48776 4.55461C5.19172 4.13223 5.99723 3.90912 6.81818 3.90912Z"
            />
            <path
              d="M5.36353 3.90911V3.18184C5.36353 2.37852 6.01475 1.72729 6.81807 1.72729C7.62139 1.72729 8.27262 2.37852 8.27262 3.18184V3.90911"
            />
          </svg>

          {hasNotification && (
            <div className="notifications-list">
              <div>
                <PerfectScrollBar>
                  {notifications.map((notification, index) => (
                    <div className="notification-item" key={index}>
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  ))}
                </PerfectScrollBar>
              </div>
            </div>
          )}
        </a>

        {isOpenModal && (
          <div className="alerts-modal-bg" ref={this.getRef}>
            <AlertsModal
              getInnerRef={this.getInnerRef}
              alerts={alerts}
              addAlerts={this.addAlerts}
              deleteAlert={this.deleteAlert}
              editAlert={this.editAlert}
              toggleMenu={this.toggleMenu}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

Notification.propTypes = {
  notifications: PropTypes.array,
};

export default Notification;