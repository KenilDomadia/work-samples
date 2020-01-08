import { css } from 'styled-components';
import sizes from './size';

const a = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
      @media only screen and (max-width: ${sizes[label]}px) {
        ${css(...args)};
      }
    `;
  return acc;
}, {});
export default a;
