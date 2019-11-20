import React from 'react';
import PropTypes from 'prop-types';

import './CountryFlag.scss';

import imgBR from './imgs/BR.svg';
import imgCA from './imgs/CA.svg';
import imgMX from './imgs/MX.svg';
import imgUS from './imgs/US.svg';
import imgAE from './imgs/AE.svg';
import imgDE from './imgs/DE.svg';
import imgES from './imgs/ES.svg';
import imgFR from './imgs/FR.svg';
import imgGB from './imgs/GB.svg';
import imgIN from './imgs/IN.svg';
import imgIT from './imgs/IT.svg';
import imgTR from './imgs/TR.svg';
import imgAU from './imgs/AU.svg';
import imgJP from './imgs/JP.svg';
import imgCN from './imgs/CN.svg';

const FLAG_IMG_BY_COUNTRYCODE = {
  'BR': imgBR,
  'CA': imgCA,
  'MX': imgMX,
  'US': imgUS,
  'AE': imgAE,
  'DE': imgDE,
  'ES': imgES,
  'FR': imgFR,
  'GB': imgGB,
  'IN': imgIN,
  'IT': imgIT,
  'TR': imgTR,
  'AU': imgAU,
  'JP': imgJP,
  'CN': imgCN,
};

const FLAG_IMG_BY_MARKETPLACE_ID = {
  'A2Q3Y263D00KWC': imgBR,
  'A2EUQ1WTGCTBG2': imgCA,
  'A1AM78C64UM0Y8': imgMX,
  'ATVPDKIKX0DER': imgUS,
  'A2VIGQ35RCS4UG': imgAE,
  'A1PA6795UKMFR9': imgDE,
  'A1RKKUPIHCS9HS': imgES,
  'A13V1IB3VIYZZH': imgFR,
  'A1F83G8C2ARO7P': imgGB,
  'A21TJRUUN4KGV': imgIN,
  'APJ6JRA9NG5V4': imgIT,
  'A33AVAJ2PDY3EV': imgTR,
  'A39IBJ37TRP1C6': imgAU,
  'A1VC38T7YXB528': imgJP,
  'AAHKV2X7AFYLW': imgCN,
};

const CountryFlag = ({ countryCode, marketplaceId, className = '', size = 'small', ...props }) => {
  const src = countryCode
    ? FLAG_IMG_BY_COUNTRYCODE[countryCode]
    : (
      marketplaceId
        ? FLAG_IMG_BY_MARKETPLACE_ID[marketplaceId]
        : null
    );

  if (!src) {
    console.error(`Can not find flag image for ${countryCode} : ${marketplaceId}`);
  }

  return (
    <img
      className={`country-flag ${className} ${size}`}
      src={src}
      alt={`Flag-${countryCode || ''}`}
      {...props}
    />
  );
};

CountryFlag.propTypes = {
  countryCode: PropTypes.string,
  marketplaceId: PropTypes.string,
  size: PropTypes.string,
};

export default CountryFlag;
