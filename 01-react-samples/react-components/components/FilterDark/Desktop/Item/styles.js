import { css } from 'emotion';

const root = (theme, disabled) => css`
  cursor: pointer;
  color: ${theme.color.dark.copper};
  font-size: 14px;
  padding: 4px 0;

  &:hover {
    color: ${theme.color.dark.silver};
  }

  ${disabled &&
    `
    cursor: not-allowed;
    color: ${theme.color.grey1};
    
    &:hover {
      color: ${theme.color.grey1};
    }
  `}
`;

export default {
  root
};
