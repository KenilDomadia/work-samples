import { css } from 'react-emotion';
import { screenReaderOnly, borderRadiusDarkTheme } from '../utils/styleConsts';

const checkBoxHover = theme => css`
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      width: 28px;
      height: 28px;
      background-color: ${theme.color.dark.white0_12};
      transition: 0.5s ease;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
`;

export const labelStylesDark = (theme, disabled) => css`
  ${alignItems};
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.1px;
  color: ${theme.color.dark.copper};
  background: transparent;
  cursor: pointer;
  fill: transparent;
  stroke: transparent;
  

  &:hover div {
    ${!disabled && checkBoxHover(theme)};
  }

  ${disabled && css`
    cursor: not-allowed;
  `};

  input {
    ${screenReaderOnly}
  }

  input ~ div.uncheckedbox {
    display: inherit;
  }

  input:checked ~ div.uncheckedbox {
    display: none;
  }

  input ~ div.checkedbox {
    display: none;
  }

  input:checked ~ div.checkedbox {
    display: inherit;
  }

  input:checked ~ span {
    color: ${theme.color.dark.amethyst};
  }

  input ~ div {
    position: relative;
    fill: ${theme.color.dark.copper};
    stroke: ${theme.color.dark.copper};
  }

  input:checked ~ div {
    position: relative;
    fill: ${theme.color.dark.amethyst};
    stroke: ${theme.color.dark.amethyst};
  }

  input:disabled ~ span {
    opacity: ${theme.color.dark.disabledOpacity};
    color: ${theme.color.dark.nickel};
    cursor: not-allowed;
  }
  input:disabled ~ div {
    opacity: ${theme.color.dark.disabledOpacity};
    cursor: not-allowed;
  }
`;

const alignItems = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

export const checkboxStylesDark = (theme, disabled) => css`
  ${alignItems};
  position: relative;
  width: 14px;
  height: 14px;
  min-width: 14px;
  min-height: 14px;
  margin-right: 10px;
  text-align: center;
  /* border: 1px solid ${theme.color.dark.copper}; */
  border-radius: ${borderRadiusDarkTheme};
  background: transparent;
  transition: background-color 0.25s, border-color 0.25s;

  &:hover {
    ${!disabled && checkBoxHover(theme)};
  }
`;
