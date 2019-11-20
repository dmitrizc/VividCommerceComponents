import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

import './MetricsSlider.scss';

const MetricsSlider = ({ className = '', children, ...props }) => {
  return (
    <div className={`metrics-slider ${className}`} {...props}>
      <Slider
        slidesToShow={8}
        slidesToScroll={8}
        dots
        infinite={false}
        variableWidth={false}
        arrows
        prevArrow={<button className="slick-prev"><i className="icon-arrow-left"/></button>}
        nextArrow={<button className="slick-next"><i className="icon-arrow-right"/></button>}
        centerMode={false}
        // respondTo="slider" - not working in react-slick
        responsive={[
          {
            breakpoint: 1800,
            settings: {
              slidesToShow: 6,
              slidesToScroll: 6,
            }
          },
          {
            breakpoint: 1590,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 5,
            }
          },
          {
            breakpoint: 1380,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4
            }
          },
          {
            breakpoint: 960,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          },
          {
            breakpoint: 750,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 540,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
        ]}
      >
        {children}
      </Slider>
    </div>
  );
};

MetricsSlider.propTypes = {
  className: PropTypes.string,
};

export default MetricsSlider;
