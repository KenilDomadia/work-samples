import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { autobind } from 'core-decorators';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';

@withTheme
class FilterDark extends React.Component {
  constructor(props) {
    super(props);
    this.controlledSelectedItems = false;
    if (Array.isArray(this.props.selectedItemsGroupArray)) {
      this.controlledSelectedItems = true;
    }
  }

  render() {
    const {
      theme,
      className,
      viewType,
      groups,
      selectedKeys,
      selectedItemsGroupArray,
      withSearch,
      onSearch,
      groupClassName
    } = this.props;

    let selectedKeysSet;
    if (Array.isArray(selectedItemsGroupArray)) {
      selectedKeysSet = new Set(
        [].concat.apply(
          [],
          selectedItemsGroupArray.map(item =>
            item.selectedItemsArray.map(selectedItem => selectedItem.key)
          )
        )
      );
    } else {
      selectedKeysSet = new Set(selectedKeys);
    }

    switch (viewType) {
      case 'desktop':
        return (
          <Desktop
            theme={theme}
            className={className}
            groups={groups}
            selectedKeysSet={selectedKeysSet}
            selectedItemsGroupArray={selectedItemsGroupArray}
            controlledSelectedItems={this.controlledSelectedItems}
            onSelectKey={this.selectKeyHandler}
            onRemoveKey={this.removeKeyHandler}
            withSearch={withSearch}
            onSearch={onSearch}
            groupClassName={groupClassName}
          />
        );

      case 'mobile':
        return (
          <Mobile
            theme={theme}
            className={className}
            groups={groups}
            selectedKeysSet={selectedKeysSet}
            selectedItemsGroupArray={selectedItemsGroupArray}
            controlledSelectedItems={this.controlledSelectedItems}
            onSelectKey={this.selectKeyHandler}
            onRemoveKey={this.removeKeyHandler}
            withSearch={withSearch}
            onSearch={onSearch}
            groupClassName={groupClassName}
          />
        );

      default:
        return false;
    }
  }

  @autobind
  selectKeyHandler(key, item, groupIndex) {
    const keys = [...this.props.selectedKeys, key];
    this.props.onChange(keys, item, groupIndex);
  }

  @autobind
  removeKeyHandler(key, item, groupIndex) {
    const keys = this.props.selectedKeys.filter(k => k !== key);
    this.props.onChange(keys, item, groupIndex, true);
  }
}

FilterDark.propTypes = {
  viewType: PropTypes.oneOf(['desktop', 'mobile']),
  groups: PropTypes.array.isRequired,
  selectedKeys: PropTypes.array,
  selectedItemsGroupArray: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  onSearch: PropTypes.func
};

FilterDark.defaultProps = {
  viewType: 'desktop',
  className: '',
  selectedKeys: [],
  selectedItemsGroupArray: null,
  onSearch: () => {}
};

export default FilterDark;
