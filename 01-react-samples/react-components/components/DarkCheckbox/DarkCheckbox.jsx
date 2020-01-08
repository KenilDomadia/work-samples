/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import c from 'classnames';
import {
  labelStylesDark,
  checkboxStylesDark
} from './DarkCheckbox.style';
import Icon from '../Icon';

@withTheme
class DarkCheckbox extends PureComponent {
  render() {
    const {
      onClick,
      theme,
      label,
      style,
      className,
      disabled,
      strokeWidth,
      ...other
    } = this.props;

    return (
      <label
        style={style}
        className={c(className, labelStylesDark(theme, disabled))}
        onClick={onClick}
      >
        <input type="checkbox" {...other} disabled={disabled} />
        <div className={c('uncheckedbox', checkboxStylesDark(theme, disabled))}>
          <Icon type="uncheckedbox" style={{ strokeWidth }} />
        </div>
        <div className={c('checkedbox', checkboxStylesDark(theme, disabled))}>
          <Icon type="checkedbox" style={{ strokeWidth }} />
        </div>
        <span>{label}</span>
      </label>
    );
  }
}

DarkCheckbox.propTypes = {
  label: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  strokeWidth: PropTypes.number
};

DarkCheckbox.defaultProps = {
  label: '',
  style: {},
  className: '',
  disabled: false,
  strokeWidth: 0.2
};

export default DarkCheckbox;
