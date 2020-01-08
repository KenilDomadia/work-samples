import React from 'react';
import { autobind } from 'core-decorators';
import CheckBox from '../../../Checkbox';
import s from './styles';

class GroupItem extends React.PureComponent {
  render() {
    const {
      theme,
      title,
      count,
      selected
    } = this.props;

    const disabled = count === 0;

    return (
      <div
        className={s.root}
        role="presentation"
        onClick={!disabled ? this.clickHandler : undefined}
      >
        <div
          className={s.checkbox}
          role="presentation"
          onClick={stubHandler}
        >
          <CheckBox
            checked={selected}
            disabled={disabled}
            onChange={this.checkboxChangeHandler}
          />
        </div>

        <div className={s.title(theme, disabled)}>
          { title }
        </div>

        {count !== undefined ?
          <div className={s.count(theme, disabled)}>
            { count }
          </div> : ''}
      </div>
    );
  }

  @autobind
  clickHandler() {
    this.props.onClick(this.props.id);
  }

  @autobind
  checkboxChangeHandler() {
    this.props.onClick(this.props.id);
  }
}

function stubHandler(event) {
  event.stopPropagation();
}

export {
  GroupItem
};
