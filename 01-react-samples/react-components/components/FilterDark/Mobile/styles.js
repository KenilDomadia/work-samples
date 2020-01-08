import { css } from 'emotion';

const root = theme => css`
  user-select: none;

  > * {
    border-bottom: 1px solid ${theme.color.separator};
  }
`;

export default {
  root
};
