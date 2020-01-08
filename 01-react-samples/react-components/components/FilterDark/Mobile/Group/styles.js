import { css } from 'emotion';

const root = theme => css`
  margin-bottom: 35px;
  border-bottom: 1px solid #e5ebf5;
  color: ${theme.color.black1};
`;

const header = css`
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  cursor: pointer;
  margin-bottom: 18px;
`;

const title = css`
  flex: 1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const items = css`
  margin-bottom: 27px;
`;

export default {
  root,
  header,
  title,
  items
};
