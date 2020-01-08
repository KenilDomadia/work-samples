import React from 'react';
import DraggableContext from './DraggableContext';

class DraggableHandle extends React.Component {
  render() {
    return (
      <DraggableContext.Consumer>
        {(context) =>
          React.cloneElement(React.Children.only(this.props.children), {
            [context.startEvent]: context[context.startEvent],
            style: {
              cursor: context.cursor
            }
          })
        }
      </DraggableContext.Consumer>
    );
  }
}

export default DraggableHandle;
