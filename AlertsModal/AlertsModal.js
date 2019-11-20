import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollBar from 'react-perfect-scrollbar';
import _find from 'lodash/find';
import ReactDOM from 'react-dom';
import { Manager, Reference, Popper } from 'react-popper';
import axios from 'axios';

import {
  ALERT_NAME_OPTIONS,
  ALERT_TYPES,
  MARKETPLACE_OPTIONS,
  FREQUENCY_OPTIONS,
  PRODUCT_CATEGORIES,
} from '../../pages/ComponentsGallery/constants';

import DataTable from '../DataTable';
import { TextInput } from '../TextInput';
import DropdownSelect from '../DropdownSelect';
import DropdownSelectFlag from '../DropdownSelect/DropdownSelectFlag';
import DropdownSelectWithSearch from '../DropdownSelect/DropdownSelectWithSearch';
import RadioSelect from '../RadioSelect';
import ToggleButton from '../ToggleButton';
import CountryFlag from '../CountryFlag';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 50000;

import './AlertsModal.scss';

class AlertsModal extends React.Component {
  state = {
    data: [],
    // data: [
    //   {
    //     id: 1,
    //     name: '',
    //     type: '',
    //     category: '',
    //     marketPlaceId: '',
    //     frequency: {
    //       type: '',
    //       time: '',
    //     },
    //     last_sent: null,
    //     status: false,
    //   },
    // ],
    isAdding: false,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = ev => {
    if (this.openedAlert && this.popperRef && !this.popperRef.contains(ev.target)) {
      this.handleClickMenu(this.openedAlert.id)();
    }
  };

  handleChange = (id, field, value, subField = 'type') => {
    const { data } = this.state;
    const index = data.findIndex(d => d.id === id);
    if (index > -1) {
      if (field === 'frequency') {
        data[index][field][subField] = value;
      } else {
        data[index][field] = value;
      }
      this.setState({ data });
    }
  };

  handleChangeDropdown = (id, field) => value => {
    this.handleChange(id, field, value);
  };

  handleClickMenu = id => () => {
    if (this.props.toggleMenu) {
      this.props.toggleMenu(id);
    }
  };

  handleDelete = id => () => {
    if (this.props.deleteAlert) {
      this.props.deleteAlert(id);
    }
  };

  handleEdit = id => () => {
    if (this.props.editAlert) {
      this.props.editAlert(id);
    }
  };

  getNameColumn = row => {
    const { isAdding } = this.state;
    const { id, name, editable, isMenuOpened } = row.original;

    if (isAdding || editable) {
      return <DropdownSelectWithSearch
        className="alerts-search"
        value={name}
        onChange={this.handleChangeDropdown(id, 'name')}
        options={ALERT_NAME_OPTIONS}
        width={378}
      />;
    }

    return <div className="w-100 d-flex align-items-center">
      <Manager>
        <Reference>
          {({ ref }) => (
            <div
              className="edit-action"
              ref={ref}
              onClick={this.handleClickMenu(id)}
            >
              <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.2 7.99998C3.2 7.11632 2.48366 6.39998 1.6 6.39998C0.716344 6.39998 0 7.11632 0 7.99998C0 8.88363 0.716344 9.59998 1.6 9.59998C2.48366 9.59998 3.2 8.88363 3.2 7.99998Z"
                  fill="#1E135F"
                />
                <path
                  d="M3.2 2.4C3.2 1.51634 2.48366 0.799998 1.6 0.799998C0.716344 0.799998 0 1.51634 0 2.4C0 3.28366 0.716344 4 1.6 4C2.48366 4 3.2 3.28366 3.2 2.4Z"
                  fill="#1E135F"
                />
                <path
                  d="M3.2 13.6C3.2 12.7164 2.48366 12 1.6 12C0.716344 12 0 12.7164 0 13.6C0 14.4837 0.716344 15.2 1.6 15.2C2.48366 15.2 3.2 14.4837 3.2 13.6Z"
                  fill="#1E135F"
                />
              </svg>
            </div>
          )}
        </Reference>

        {isMenuOpened && ReactDOM.createPortal(
          <Popper
            placement="left"
            positionFixed={false}
            modifiers={{
              flip: { enabled: true },
              offset: { enabled: true, offset: '0,2px' },
              shift: { enabled: false },
              preventOverflow: { enabled: false },
              computeStyle: { gpuAcceleration: false },
            }}
          >
            {({ placement, ref, style }) => (
              <div
                className="edit-options"
                ref={e => {
                  ref(e);
                  this.popperRef = e;
                }}
                style={style}
                data-placeholder={placement}
              >
                <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg"
                     onClick={this.handleDelete(id)}>
                  <path
                    d="M4.71429 4.77344V10.2578C4.71429 10.4261 4.58236 10.5625 4.41964 10.5625H3.83036C3.66764 10.5625 3.53571 10.4261 3.53571 10.2578V4.77344C3.53571 4.60517 3.66764 4.46875 3.83036 4.46875H4.41964C4.58236 4.46875 4.71429 4.60517 4.71429 4.77344ZM7.16964 4.46875H6.58036C6.41764 4.46875 6.28571 4.60517 6.28571 4.77344V10.2578C6.28571 10.4261 6.41764 10.5625 6.58036 10.5625H7.16964C7.33236 10.5625 7.46429 10.4261 7.46429 10.2578V4.77344C7.46429 4.60517 7.33236 4.46875 7.16964 4.46875ZM10.4107 2.03125C10.7362 2.03125 11 2.30407 11 2.64062V2.94531C11 3.11358 10.8681 3.25 10.7054 3.25H10.2143V11.7812C10.2143 12.4544 9.68663 13 9.03571 13H1.96429C1.31337 13 0.785714 12.4544 0.785714 11.7812V3.25H0.294643C0.131926 3.25 0 3.11358 0 2.94531V2.64062C0 2.30407 0.263828 2.03125 0.589286 2.03125H2.41634L3.2516 0.591703C3.35632 0.411235 3.50444 0.261882 3.68155 0.158189C3.85865 0.0544968 4.05871 -2.0248e-06 4.26223 0L6.73779 0C6.94132 -2.0248e-06 7.14137 0.0544968 7.31848 0.158189C7.49559 0.261882 7.64371 0.411235 7.74842 0.591703L8.58366 2.03125H10.4107ZM3.7908 2.03125H7.20922L6.78071 1.29271C6.76763 1.27015 6.74911 1.25149 6.72697 1.23852C6.70483 1.22556 6.67983 1.21875 6.65439 1.21875H4.34566C4.32022 1.21875 4.29522 1.22556 4.27308 1.23852C4.25094 1.25149 4.23242 1.27015 4.21933 1.29271L3.7908 2.03125ZM9.03571 3.25H1.96429V11.6289C1.96429 11.6693 1.97981 11.7081 2.00744 11.7366C2.03506 11.7652 2.07254 11.7812 2.11161 11.7812H8.88839C8.92746 11.7812 8.96494 11.7652 8.99257 11.7366C9.02019 11.7081 9.03571 11.6693 9.03571 11.6289V3.25Z" />
                </svg>

                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                     onClick={this.handleEdit(id)}>
                  <path d="M1 10L7.5 3.5L10.5002 6.5L4.00024 13H1.00024L1 10Z" strokeWidth="0.75" />
                  <path d="M13.0002 4L11.5 5.5L8.5 2.5L10.0002 1C12.4002 1.4 13.0002 3.16667 13.0002 4Z" fill="#4B42C6"
                        strokeWidth="0.75" />
                </svg>
              </div>
            )}
          </Popper>
          , document.querySelector('.main-content'),
        )}
      </Manager>

      <span>{name}</span>
    </div>;
  };

  getTypeColumn = row => {
    const { isAdding } = this.state;
    const { id, type, editable } = row.original;

    if (isAdding || editable) {
      return <DropdownSelect
        className="alerts"
        value={type}
        options={ALERT_TYPES}
        onChange={this.handleChangeDropdown(id, 'type')}
      />;
    }

    const option = _find(ALERT_TYPES, { value: type });
    return <div className="d-flex align-items-center justify-content-center">
      <div className="alert-static-content">
        {option && option.label}
      </div>
    </div>;
  };

  getCategoryColumn = row => {
    const { isAdding } = this.state;
    const { id, category, editable } = row.original;

    if (isAdding || editable) {
      return <DropdownSelect
        className="alerts"
        value={category}
        options={PRODUCT_CATEGORIES}
        onChange={this.handleChangeDropdown(id, 'category')}
      />;
    }

    const option = _find(PRODUCT_CATEGORIES, { value: category });
    return <div className="d-flex align-items-center justify-content-center">
      <div className="alert-static-content">
        {option && option.label}
      </div>
    </div>;
  };

  getMarketColumn = row => {
    const { isAdding } = this.state;
    const { id, marketPlaceId, editable } = row.original;

    if (isAdding || editable) {
      return <DropdownSelectFlag
        className="alerts"
        value={marketPlaceId}
        options={MARKETPLACE_OPTIONS}
        onChange={this.handleChangeDropdown(id, 'marketPlaceId')}
      />;
    }

    return <div className="d-flex align-items-center justify-content-center">
      <div className="alert-static-content">
        <CountryFlag marketplaceId={marketPlaceId} />
      </div>
    </div>;
  };

  getFrequencyColumn = row => {
    const { isAdding } = this.state;
    const { id, frequency, editable } = row.original;
    const readOnly = !isAdding && !editable;

    return <div className="d-flex align-items-center justify-content-center">
      <RadioSelect
        options={FREQUENCY_OPTIONS}
        readOnly={readOnly}
        value={frequency.type}
        onChange={this.handleChangeDropdown(id, 'frequency')}
      />

      <div className="frequency-time">
        <TextInput
          value={frequency.time}
          readOnly={readOnly}
          onChange={e => this.handleChange(id, 'frequency', e.target.value, 'time')}
        />
      </div>
    </div>;
  };

  getColumns = () => {
    const { isAdding } = this.state;

    return [
      {
        Header: isAdding ? 'New Alert' : 'Current Alerts',
        id: 'name',
        minWidth: 220,
        Cell: this.getNameColumn,
      },
      {
        Header: 'Alert Type',
        id: 'type',
        minWidth: 90,
        Cell: this.getTypeColumn,
      },
      {
        Header: 'Product Category',
        id: 'category',
        minWidth: 120,
        Cell: this.getCategoryColumn,
      },
      {
        Header: 'Product Market',
        id: 'marketPlaceId',
        minWidth: 120,
        Cell: this.getMarketColumn,
      },
      {
        Header: 'Frequency',
        id: 'frequency',
        minWidth: 150,
        Cell: this.getFrequencyColumn,
      },
      {
        Header: 'Last Sent',
        id: 'last_sent',
        minWidth: 90,
        Cell: row => {
          const { last_sent } = row.original;
          return <span className="last-sent">{last_sent ? last_sent : 'Never'}</span>;
        },
      },
      {
        Header: 'Status',
        id: 'status',
        minWidth: 70,
        Cell: row => {
          const { id, status, editable } = row.original;
          return <ToggleButton
            readOnly={!isAdding && !editable}
            value={status}
            onChange={() => this.handleChange(id, 'status', !status)}
          />;
        },
      },
    ];
  };

  addAlert = () => {
    const { data } = this.state;
    data.push({
      id: data.length + 1,
      name: '',
      type: '',
      category: '',
      marketPlaceId: '',
      frequency: {
        type: '',
        time: '',
      },
      last_sent: null,
      status: false,
    });

    this.setState({ data });
  };

  toggleAdding = () => {
    this.setState(prevState => ({
      isAdding: !prevState.isAdding,
    }));
  };

  onConfirm = () => {
    if (this.props.addAlerts) {
      this.props.addAlerts(this.state.data);
    }
    this.toggleAdding();
  };

  render() {
    const { data, isAdding } = this.state;
    const {
      title = 'BuyBox Alerts',
      getInnerRef,
      alerts = [],
    } = this.props;

    const tableData = isAdding ? data : alerts;

    this.openedAlert = _find(alerts, { isMenuOpened: true });

    return (
      <div className="alerts-modal" ref={getInnerRef}>
        <div className="alerts-modal-header d-flex align-items-center justify-content-between">
          <h3 className="modal-title">{title}</h3>

          {isAdding ? (
            <div className="modal-actions d-flex align-items-center">
              <button className="btn-static-secondary long" onClick={this.onConfirm}>Confirm</button>
              <button className="btn-static long cancel" onClick={this.toggleAdding}>Cancel</button>
            </div>
          ) : (
            <button className="btn-static-secondary long" onClick={this.toggleAdding}>+ New Alert</button>
          )}
        </div>

        <div className="alerts-modal-content">
          <PerfectScrollBar>
            <DataTable data={tableData} columns={this.getColumns()} defaultPageSize={tableData.length}
                       pageSize={tableData.length} />

            {isAdding && (
              <div className="add-alert">
                <button className="btn-static long" onClick={this.addAlert}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M7.5 14.0625C3.87563 14.0625 0.9375 11.1234 0.9375 7.5C0.9375 3.87656 3.87563 0.9375 7.5 0.9375C11.1244 0.9375 14.0625 3.87656 14.0625 7.5C14.0625 11.1234 11.1244 14.0625 7.5 14.0625ZM7.5 0C3.35766 0 0 3.35625 0 7.5C0 11.6438 3.35766 15 7.5 15C11.6423 15 15 11.6438 15 7.5C15 3.35625 11.6423 0 7.5 0ZM10.3125 7.03125H7.96875V4.6875C7.96875 4.42969 7.75922 4.21875 7.5 4.21875C7.24078 4.21875 7.03125 4.42969 7.03125 4.6875V7.03125H4.6875C4.42828 7.03125 4.21875 7.24219 4.21875 7.5C4.21875 7.75781 4.42828 7.96875 4.6875 7.96875H7.03125V10.3125C7.03125 10.5703 7.24078 10.7812 7.5 10.7812C7.75922 10.7812 7.96875 10.5703 7.96875 10.3125V7.96875H10.3125C10.5717 7.96875 10.7812 7.75781 10.7812 7.5C10.7812 7.24219 10.5717 7.03125 10.3125 7.03125Z"
                          fill="#4B42C6" />
                  </svg>
                  Add Alert
                </button>
              </div>
            )}
          </PerfectScrollBar>
        </div>
      </div>
    );
  }
}

AlertsModal.propTypes = {
  title: PropTypes.string,
  getInnerRef: PropTypes.func,
  alerts: PropTypes.array,
  addAlerts: PropTypes.func,
  deleteAlert: PropTypes.func,
  editAlert: PropTypes.func,
  toggleMenu: PropTypes.func,
};

export default AlertsModal;
