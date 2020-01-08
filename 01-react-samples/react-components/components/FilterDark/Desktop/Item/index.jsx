import React from 'react';
import { autobind } from 'core-decorators';
import s from './styles';

class Item extends React.PureComponent {
  render() {
    const {
      title,
      count,
      theme,
    } = this.props;

    const disabled = count === 0;

    return (
      <div
        className={s.root(theme, disabled)}
        role="presentation"
        onClick={!disabled ? this.clickHandler : undefined}
      >
        {`${title} ${count !== undefined ? `(${count})` : ''}`}
      </div>
    );
  }

  @autobind
  clickHandler() {
    this.props.onClick(this.props.id, this.props.item);
  }
}

export {
  Item
};
