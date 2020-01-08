import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles';
import { Group } from './Group';

class Mobile extends React.Component {
  render() {
    const {
      theme,
      className,
      groups,
      selectedKeysSet,
      onSelectKey,
      onRemoveKey
    } = this.props;

    return (
      <div className={c(s.root, className)}>
        {
          groups.map(g => (
            <Group
              key={g.key}
              theme={theme}
              group={g}
              selectedKeysSet={selectedKeysSet}
              onSelectKey={onSelectKey}
              onRemoveKey={onRemoveKey}
            />
          ))
        }
      </div>
    );
  }
}

Mobile.propTypes = {
  theme: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  groups: PropTypes.array.isRequired,
  selectedKeysSet: PropTypes.instanceOf(Set).isRequired,
  onSelectKey: PropTypes.func.isRequired,
  onRemoveKey: PropTypes.func.isRequired
};

export {
  Mobile
};
