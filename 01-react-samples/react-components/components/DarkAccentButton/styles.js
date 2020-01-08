import { css } from 'emotion';
import ButtonSelectionType from './selectionType';

export const root = (theme, rounded, { selected, type }, disabled) => css`
  color: ${theme.color.dark.white};
  fill: ${theme.color.dark.white};
  border-radius: ${rounded ? '30px' : '2px'};
  font-weight: 500;
  letter-spacing: 0.86px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  border: none;
  outline: none;
  position: relative;

  transition: all 0.3s;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  text-transform: ${type === ButtonSelectionType.Normal ? '' : 'uppercase'};

  background-color: ${selected
    ? type === ButtonSelectionType.Normal
      ? theme.color.dark.white0_12
      : theme.color.dark.sapphire
    : 'transparent'};

  padding: ${rounded ? '12px' : '16px 12px'};

  &:hover {
    background-color: ${theme.color.dark.sapphireHover};
  }

  &:focus,
  &:active {
    background-color: ${theme.color.dark.sapphireFocus};
  }
`;

export const notification = (theme, count) => css`
  position: absolute;
  top: 2px;
  right: 20px;
  width: 0px;

  &::after {
    content: '${count}';

    display: flex;
    align-items: center;

    height: 16px;
    width: fit-content;
    border-radius: 10px;
    padding: 0px 4px;

    color: ${theme.color.dark.white};
    background-color: ${theme.color.dark.sapphire};

    font-size: 12px;
    font-weight: bold;
    line-height: normal;
  }
`;
