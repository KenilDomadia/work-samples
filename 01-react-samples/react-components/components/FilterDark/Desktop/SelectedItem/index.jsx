import React from 'react';
import { autobind } from 'core-decorators';
import Tag from '../../../Tag';

class SelectedItem extends React.PureComponent {
  render() {
    const { title } = this.props;

    return (
      <Tag
        value={title}
        canClose={true}
        onCloseClick={this.closeClickHandler}
      />
    );
  }

  @autobind
  closeClickHandler() {
    this.props.onClick(this.props.id, this.props.item);
  }
}

export {
  SelectedItem
};
