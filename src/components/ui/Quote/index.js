import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage } from "gatsby-plugin-image"

import * as Styled from './styles';

const Quote = ({ title, subtitle, content, linkTo, linkText, quote, quoteAttribution, quoteAvatar, quoteSubtitle, quoteUrl}) => {
  return (
      <Styled.BlockQuote border-color="bg-indido-900">
        <p className="mb-4">{quote}</p>
        <cite className="flex items-center">
          <GatsbyImage image={quoteAvatar.childImageSharp.gatsbyImageData} alt={`Avator of ${quoteAttribution}`} className="w-12 mr-4 rounded-full bg-neutral-500"/>
          <div className="flex flex-col items-start">
            <span className="mb-1 text-sm tialic font-bold">
              {quoteAttribution}
            </span>
            <a className="text-sm" href={quoteUrl} target="_blank" rel="noopener noreferrer">
              {quoteSubtitle}
            </a>
          </div>
        </cite>
      </Styled.BlockQuote>
    );
};

Quote.propTypes = {
  quote: PropTypes.string.isRequired,
  quoteAttribution: PropTypes.string,
  quoteAvatar: PropTypes.any.isRequired,
  quoteSubtitle: PropTypes.string.isRequired,
};

export default Quote;
