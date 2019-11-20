import React from 'react';

import './TextInput.scss';

const SearchIcon = props => (
  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10.1834 6.55882C10.1834 4.03888 8.12765 1.99606 5.59172 1.99606C3.05578 1.99606 1 4.03888 1 6.55882C1 9.07877 3.05578 11.1216 5.59172 11.1216C8.12765 11.1216 10.1834 9.07877 10.1834 6.55882Z"
      stroke="#4B42C6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M8.91553 9.93133L11.9997 12.9961" stroke="#4B42C6" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TextInputWrapper = ({ children, className = '', ...props }) => (
  <div className={`text-input-wrapper ${className}`} {...props}>
    {children}
  </div>
);

const TextInput = ({ className = '', ...props }) => (
  <input className={`text-input-ctrl ${className}`} {...props} />
);

const TextArea = ({ className = '', ...props }) => (
  <textarea className={`text-area-ctrl ${className}`} {...props} />
);

const TextInputAddon = ({ children, className = '', ...props }) => (
  <div className={`text-input-addon ${className}`} {...props}>
    {children}
  </div>
);

export {
  TextInputWrapper,
  TextInput,
  TextArea,
  TextInputAddon,
  SearchIcon,
};
