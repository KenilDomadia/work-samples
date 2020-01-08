import { css } from 'emotion';

const root = css`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 9px 0;
`;

const checkbox = css`
  margin-right: 16px;
`;

const title = (theme, disabled) => css`
  flex: 1;
  font-size: 18px;
  color: ${theme.color.black1};
  
  ${disabled && `
    color: ${theme.color.grey1};
  `}
`;

const count = (theme, disabled) => css`
  flex: none;
  font-size: 16px;
  color: ${theme.color.black3};
  
  ${disabled && `
    color: ${theme.color.grey1};
  `}
`;

export default {
  root,
  checkbox,
  title,
  count
};
