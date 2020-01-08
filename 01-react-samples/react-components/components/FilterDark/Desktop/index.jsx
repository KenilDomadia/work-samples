import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import c from 'classnames';
import DarkButton from '../../Button/DarkButton';
import Icon from '../../Icon';
import Expandable from '../../Expandable';
import s from './styles';
import { Group } from './Group';

const getGroupSelectedItems = (groupIndex, selectedItemsGroupArray) => {
  let groupItem = selectedItemsGroupArray.filter(
    item => item.groupIndex === groupIndex
  );
  groupItem = groupItem.length > 0 ? groupItem[0] : {};
  return groupItem.selectedItemsArray || [];
};

class Desktop extends React.Component {
  state = {
    expanded: false
  };

  render() {
    const {
      groups,
      selectedKeysSet,
      controlledSelectedItems,
      selectedItemsGroupArray,
      onSelectKey,
      onRemoveKey,
      theme,
      className,
      withSearch,
      onSearch,
      groupClassName
    } = this.props;

    const { expanded } = this.state;

    const showExpandButton = groups.some(g => !g.primary);

    return (
      <div className={c(s.root, className)}>
        {renderGroups(
          groups,
          expanded,
          selectedKeysSet,
          onSelectKey,
          onRemoveKey,
          withSearch,
          onSearch,
          theme,
          groupClassName,
          controlledSelectedItems,
          selectedItemsGroupArray
        )}

        {showExpandButton &&
          renderExpandButton(expanded, this.expandClickHandler)}
      </div>
    );
  }

  @autobind
  expandClickHandler() {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  }
}

Desktop.propTypes = {
  theme: PropTypes.any.isRequired,
  className: PropTypes.string.isRequired,
  groups: PropTypes.array.isRequired,
  selectedKeysSet: PropTypes.instanceOf(Set).isRequired,
  onSelectKey: PropTypes.func.isRequired,
  onRemoveKey: PropTypes.func.isRequired,
  onSearch: PropTypes.func
};

Desktop.defaultProps = {
  onSearch: () => {}
};

function renderGroups(
  groups,
  expanded,
  selectedKeysSet,
  onSelectKey,
  onRemoveKey,
  withSearch,
  onSearch,
  theme,
  groupClassName,
  controlledSelectedItems,
  selectedItemsGroupArray
) {
  return (
    <div className={s.groups(theme)}>
      {groups.map((g, index) => (
        <Expandable
          key={g.key}
          visible={isGroupVisible(
            g,
            expanded,
            selectedKeysSet,
            index,
            controlledSelectedItems,
            selectedItemsGroupArray
          )}
        >
          <Group
            index={index}
            group={g}
            selectedKeysSet={selectedKeysSet}
            controlledSelectedItems={controlledSelectedItems}
            selectedItemsGroupArray={selectedItemsGroupArray}
            groupSelectedItems={
              controlledSelectedItems
                ? getGroupSelectedItems(index, selectedItemsGroupArray)
                : []
            }
            onSelectKey={onSelectKey}
            onRemoveKey={onRemoveKey}
            withSearch={withSearch}
            theme={theme}
            onSearch={onSearch}
            groupClassName={groupClassName}
          />
        </Expandable>
      ))}
    </div>
  );
}

function renderExpandButton(expanded, clickHandler) {
  return (
    <DarkButton.TextButton
      onClick={clickHandler}
      style={{
        fontSize: '16px'
      }}
    >
      {expanded ? 'Less' : 'More'}
      <Icon
        type="angle-down"
        rotate={expanded ? 180 : 0}
        style={{ marginLeft: '6px', width: '14px', height: '14px' }}
      />
    </DarkButton.TextButton>
  );
}

function isGroupVisible(
  group,
  expanded,
  selectedKeysSet,
  groupIndex,
  controlledSelectedItems,
  selectedItemsGroupArray
) {
  if (group.items.length === 0 && !controlledSelectedItems) {
    return false;
  }
  let groupHasSelectedItems = false;
  if (controlledSelectedItems) {
    const groupSelectedItemsArray = getGroupSelectedItems(
      groupIndex,
      selectedItemsGroupArray
    );
    if (groupSelectedItemsArray.length > 0) {
      groupHasSelectedItems = true;
    }
  }

  return (
    expanded ||
    group.primary ||
    group.items.some(i => selectedKeysSet.has(i.key)) ||
    groupHasSelectedItems
  );
}

export { Desktop };
