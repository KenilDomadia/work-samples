import { css } from 'emotion';

const root = css`
  user-select: none;
  box-sizing: border-box;

  > * {
    margin-bottom: 21px;
  }
`;

const groups = theme => css`
  > * {
    border-bottom: 1px solid ${theme.color.dark.venus};
  }
`;

export default {
  root,
  groups
};
