import React from 'react';
import { autobind } from 'core-decorators';
import s from './styles';
import { GroupItem } from '../GroupItem';

class Group extends React.PureComponent {
  render() {
    const {
      theme,
      group,
      selectedKeysSet
    } = this.props;

    return (
      <div className={s.root(theme)}>
        { renderHeader(group.title, this.headerClickHandler) }
        { renderItems(group.items, selectedKeysSet, this.itemClickHandler, theme) }
      </div>
    );
  }

  @autobind
  itemClickHandler(key) {
    if (this.props.selectedKeysSet.has(key)) {
      this.props.onRemoveKey(key);
    } else {
      this.props.onSelectKey(key);
    }
  }
}

function renderHeader(title, clickHandler) {
  return (
    <div
      className={s.header}
      role="presentation"
      onClick={clickHandler}
    >
      <div className={s.title}>
        { title }
      </div>
    </div>
  );
}

function renderItems(items, selectedKeysSet, itemClickHandler, theme) {
  return (
    <div className={s.items}>
      {
        items.map(i => (
          <GroupItem
            key={i.key}
            theme={theme}
            id={i.key}
            title={i.title}
            count={i.count}
            selected={selectedKeysSet.has(i.key)}
            onClick={itemClickHandler}
          />
        ))
      }
    </div>
  );
}

export {
  Group
};
