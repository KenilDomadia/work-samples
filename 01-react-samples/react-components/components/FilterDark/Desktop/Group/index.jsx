import React from 'react';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import s from './styles';
import Expandable from '../../../Expandable';
import { Item } from '../Item';
import { SelectedItem } from '../SelectedItem';
import DarkBoxInput from '../../../Input/DarkBoxInput';

class Group extends React.Component {
  state = {
    expanded: false,
    searchText: ''
  };

  render() {
    const {
      group,
      selectedKeysSet,
      theme,
      withSearch,
      groupClassName,
      controlledSelectedItems,
      groupSelectedItems
    } = this.props;

    const { expanded } = this.state;

    const items = getItems(group.items, selectedKeysSet);
    let selectedItems;
    if (controlledSelectedItems) {
      selectedItems = groupSelectedItems;
    } else {
      selectedItems = getSelectedItems(group.items, selectedKeysSet);
    }

    return (
      <div className={classNames(s.root(theme), groupClassName)}>
        {renderHeader(group.title, expanded, this.headerClickHandler, theme)}

        {selectedItems.length !== 0 &&
          renderSelectedItems(
            selectedItems,
            this.selectedItemClickHandler,
            theme
          )}
        {expanded && withSearch && (
          <DarkBoxInput
            type="small"
            onChange={this.handleItemSearch}
            placeholder="Type to search..."
          />
        )}
        {renderItems(
          (items.length !== 0 || controlledSelectedItems) && expanded,
          items,
          this.itemClickHandler,
          this.state.searchText,
          theme
        )}
      </div>
    );
  }

  @autobind
  handleItemSearch(e) {
    this.setState({
      searchText: e.target.value
    });
    this.props.onSearch(e.target.value, this.props.index);
  }

  @autobind
  headerClickHandler() {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  }

  @autobind
  itemClickHandler(key, item) {
    this.props.onSelectKey(key, item, this.props.index);
  }

  @autobind
  selectedItemClickHandler(key, item) {
    this.props.onRemoveKey(key, item, this.props.index);
  }
}

function renderHeader(title, expanded, clickHandler, theme) {
  return (
    <div className={s.header} role="presentation" onClick={clickHandler}>
      <div className={s.title}>{title}</div>
      <div className={s.toggleIcon()}>
        <div className={s.toggleHorizontal(theme, expanded)} />
        <div className={s.toggleVertical(theme, expanded)} />
      </div>
    </div>
  );
}

function renderSelectedItems(items, itemClickHandler, theme) {
  return (
    <div className={s.selectedItems}>
      {items.map(i => (
        <SelectedItem
          id={i.key}
          title={i.title}
          key={i.key}
          item={i}
          theme={theme}
          onClick={itemClickHandler}
        />
      ))}
    </div>
  );
}

function renderItems(visible, items, itemClickHandler, searchText, theme) {
  const filteredItems = items.filter((item) => {
    if (item.title.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }
    return false;
  });

  return (
    <Expandable visible={visible}>
      <div className={s.items(theme)}>
        {filteredItems.length === 0 && <div>No results found</div>}
        {filteredItems.length > 0 &&
          filteredItems.map(i => (
            <Item
              id={i.key}
              title={i.title}
              count={i.count}
              key={i.key}
              item={i}
              theme={theme}
              onClick={itemClickHandler}
            />
          ))}
      </div>
    </Expandable>
  );
}

function getItems(items, selectedKeysSet) {
  return items.filter(i => !selectedKeysSet.has(i.key));
}

function getSelectedItems(items, selectedKeysSet) {
  return items.filter(i => selectedKeysSet.has(i.key)).slice();
}

export { Group };
