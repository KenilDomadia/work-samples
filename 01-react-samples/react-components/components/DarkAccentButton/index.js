import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import c from 'classnames';

import { Icon } from '../../';

import * as s from './styles';
import ButtonSelectionType from './selectionType';

function hasOnlyIcon(children) {
  if (React.Children.count(children) !== 1) {
    return false;
  }

  const child = React.Children.toArray(children)[0];
  return child.type === Icon;
}

function renderNotification(notification, theme) {
  if (!notification.count) {
    return null;
  }

  const { count, className, ...otherProps } = notification;
  return <div className={c(className, s.notification(theme, count))} {...otherProps} />;
}

function DarkAccentButton(props) {
  const {
    children,
    selected,
    selectionType,
    disabled,
    theme,
    className,
    notification,
    ...otherProps
  } = props;

  const rounded = selectionType === ButtonSelectionType.Normal && hasOnlyIcon(children);

  return (
    <button
      disabled={disabled}
      className={c(s.root(theme, rounded, { selected, type: selectionType }, disabled), className)}
      {...otherProps}
    >
      {children}
      {renderNotification(notification, theme)}
    </button>
  );
}

DarkAccentButton.defaultProps = {
  selected: false,
  selectionType: ButtonSelectionType.Normal,
  notification: { count: 0 }
};

DarkAccentButton.propTypes = {
  selected: PropTypes.bool,
  selectionType: PropTypes.oneOf(Object.values(ButtonSelectionType)),
  notification: PropTypes.shape({ count: PropTypes.string, className: PropTypes.string })
};

DarkAccentButton.selectionType = ButtonSelectionType;

export default withTheme(DarkAccentButton);
