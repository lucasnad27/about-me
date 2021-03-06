import React from 'react';
import PropTypes from 'prop-types';

import * as Styled from './styles';

const Button = ({ primary, block, children }) => (
  <Styled.Button type="submit" primary={primary} block={block} whileHover={{ scale: 1.05 }} whiletap={{ scale: 0.95 }}>
    {children}
  </Styled.Button>
);

Button.propTypes = {
  primary: PropTypes.bool,
  block: PropTypes.bool,
  children: PropTypes.any.isRequired
};

export default Button;
