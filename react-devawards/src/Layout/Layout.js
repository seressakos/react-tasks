import React from 'react';
import styled, {css} from 'styled-components';
import { device } from './Brakepoints';
import { containerWidth } from '../Variables/Variables';
import { gutterWidth } from '../Variables/Variables'

export const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
  padding-left: ${gutterWidth / 2}px;
  padding-right: ${gutterWidth / 2}px;
  
  @media only screen and ${device.tabletPortrait} {
    max-width: ${containerWidth};
  }
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => {
    if (props.alignStart) {
      return 'flex-start';
    } else if (props.alignEnd) {
      return 'flex-end';
    } else {
      return 'center';
    }
  }};
  justify-content: ${props => {
    if (props.justifyStart) {
      return 'flex-start';
    } else if (props.justifyEnd) {
      return 'flex-end';
    } else if (props.spaceBetween) {
      return 'space-between'
    } else {
      return 'center';
   }
 }};
  
  @media only screen and ${device.tabletLandscape} {
    flex-direction: row;
  }
`;

export const Column = styled.div`
    @media only screen and ${device.tabletLandscape} {
    max-width: ${props => {
      if (props.columnOne) {
        return '100%'
      }
    }
  }
`;
