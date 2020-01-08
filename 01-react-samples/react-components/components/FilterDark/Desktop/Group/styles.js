import { css } from 'emotion';

const root = theme => css`
  color: ${theme.color.dark.silver};
  background-color: ${theme.color.dark.mars};
`;

const header = css`
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  cursor: pointer;
  padding: 16px 16px;
`;

const title = css`
  flex: 1;
  font-size: 16px;
  letter-spacing: 0px;
  text-transform: capitalize;
`;

const toggleIcon = () => css`
  position: relative;
`;

const toggleHorizontal = (theme, expanded) => css`
  position: absolute;
  background-color: ${theme.color.dark.sapphire};
  width: 14px;
  height: 2px;
  left: 50%;
  margin-left: -14px;
  top: 50%;
  margin-top: -1.5px;
  transition: all 0.2s ease-in-out;
  transform: rotate(-90deg);
  opacity: 1;
  border-radius: 1px;
  ${expanded &&
    `
    transition: all 0.2s ease-in-out;
    transform: rotate(90deg);
    opacity: 0;
  `}
`;

const toggleVertical = (theme, expanded) => css`
  position: absolute;
  background-color: ${theme.color.dark.sapphire};
  width: 2px;
  height: 14px;
  left: 50%;
  margin-left: -8px;
  top: 50%;
  margin-top: -7.5px;
  transition: all 0.2s ease-in-out;
  transform: rotate(-90deg);
  border-radius: 1px;
  ${expanded &&
    `
    transition: all 0.2s ease-in-out;
    transform: rotate(90deg);
  `}
`;

const selectedItem = css`
  display: inline-block;
`;

const selectedItems = css`
  padding: 0 16px;
  margin-bottom: 6px;

  > * {
    margin-bottom: 8px;
  }

  > *:not(:last-child) {
    margin-right: 8px;
  }
`;

const items = theme => css`
  padding: 16px 20px;
  color: ${theme.color.dark.iron};
  background-color: ${theme.color.dark.saturn};
  margin-top: 2px;
  /* margin-bottom: 14px; */
  max-height: 150px;
  overflow-y: auto;
`;

export default {
  root,
  header,
  title,
  toggleIcon,
  toggleHorizontal,
  toggleVertical,
  selectedItem,
  selectedItems,
  items
};
