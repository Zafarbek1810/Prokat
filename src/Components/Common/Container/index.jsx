import React from 'react';
import PropTypes from "prop-types";
import { StyledContainer } from './Container.style';

const Container = ({ children, width, ...props }) => {
    return (
        <StyledContainer width={width} {...props}>
            {children}
        </StyledContainer>
    );
};

Container.proptypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    width: PropTypes.number,
  };

export default Container;