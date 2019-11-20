import React from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippy.js/react';

import './ProductDetails.scss';

import CountryFlag from '../CountryFlag';

class ProductDetails extends React.Component {
  state = {};

  render() {
    const {
      productPhoto,
      productTitle,
      productCountry,
      productASIN,
      marketplaceId,
    } = this.props;

    return (
      <div className="product-details-1">
        <div className="product-details-1__image">
          <img src={productPhoto} alt="Product Image" />
        </div>
        <div className="product-details-1__info">
          <span className="product-details-1__title">
            <Tippy
              content={productTitle}
              distance={-18}
              offset={"-4, 0"}
              placement="bottom-start"
              animation="fade"
              delay={500}
              maxWidth={500}
              boundary="window"
              theme="product-details"
              popperOptions={{ modifiers: { computeStyle: { gpuAcceleration: false } } }}
            >
              <span>
                {productTitle}
              </span>
            </Tippy>
          </span>
          <div className="product-details-1__subtitle">
            <CountryFlag
              className="product-details-1__flag"
              countryCode={productCountry}
              marketplaceId={marketplaceId}
            />
            <span className="product-details-1__asin">
              {productASIN}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

ProductDetails.propTypes = {
  productPhoto: PropTypes.string.isRequired,
  productTitle: PropTypes.string.isRequired,
  productCountry: PropTypes.string,
  marketplaceId: PropTypes.string,
  productASIN: PropTypes.string.isRequired,
};

export default ProductDetails;
