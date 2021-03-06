import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

import Banner from 'components/ui/Banner';

const HeroBanner = () => {
  const { markdownRemark } = useStaticQuery(graphql`
    query {
      markdownRemark(frontmatter: { category: { eq: "hero section" } }) {
        frontmatter {
          title
          subtitle
          content
          linkTo
          linkText
          quote
          quoteAttribution
          quoteSubtitle
          quoteUrl
          quoteAvatar {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  `);

  const heroBanner = markdownRemark.frontmatter;

  return (
    <Banner
      title={heroBanner.title}
      subtitle={heroBanner.subtitle}
      content={heroBanner.content}
      linkTo={heroBanner.linkTo}
      linkText={heroBanner.linkText}
      quote={heroBanner.quote}
      quoteAttribution={heroBanner.quoteAttribution}
      quoteAvatar={heroBanner.quoteAvatar}
      quoteSubtitle={heroBanner.quoteSubtitle}
      quoteUrl={heroBanner.quoteUrl}
    />
  );
};

HeroBanner.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.string,
  linkTo: PropTypes.string,
  linkText: PropTypes.string
};

export default HeroBanner;
