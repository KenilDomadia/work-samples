import React from 'react';
import PropTypes from 'prop-types';
import DraggableContext from './DraggableContext';
import DraggableHandle from './DraggableHandle';

class Draggable extends React.Component {
  constructor(props) {
    super(props);

    this.currentX = 0;
    this.currentY = 0;

    this.state = {
      position: null,
      cursor: 'grab'
    };
    this.isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
  }

  handleMouseDown = (e) => {
    let clientX;
    let clientY;
    let moveEvent;
    let endEvent;
    if (!this.isTouchDevice) {
      e.preventDefault();
      clientX = e.clientX;
      clientY = e.clientY;
      moveEvent = 'onmousemove';
      endEvent = 'onmouseup';
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      moveEvent = 'ontouchmove';
      endEvent = 'ontouchend';
    }

    this.currentX = clientX;
    this.currentY = clientY;

    this.setState({ cursor: 'grabbing' });

    const { container } = this.props;
    container[moveEvent] = this.handleMouseMove;
    container[endEvent] = this.handleMouseUp;
  };

  handleMouseUp = () => {
    let moveEvent;
    let endEvent;
    if (!this.isTouchDevice) {
      moveEvent = 'onmousemove';
      endEvent = 'onmouseup';
    } else {
      moveEvent = 'ontouchmove';
      endEvent = 'ontouchend';
    }
    this.setState({ cursor: 'grab' });

    const { container } = this.props;
    container[moveEvent] = null;
    container[endEvent] = null;
  };

  handleMouseMove = (e) => {
    let clientX;
    let clientY;
    if (!this.isTouchDevice) {
      e.preventDefault();
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const distanceX = this.currentX - clientX;
    const distanceY = this.currentY - clientY;
    this.currentX = clientX;
    this.currentY = clientY;

    const left = this.node.offsetLeft - distanceX;
    const top = this.node.offsetTop - distanceY;

    this.setState({ position: { top, left } });
  };

  render() {
    const { position } = this.state;
    const style = position ? { top: position.top, left: position.left } : undefined;

    const child = React.Children.only(this.props.children);

    const startEvent = this.isTouchDevice ? 'onTouchStart' : 'onMouseDown';
    const endEvent = this.isTouchDevice ? 'onTouchEnd' : 'onMouseUp';

    return (
      <DraggableContext.Provider
        value={{
          [startEvent]: this.handleMouseDown,
          [endEvent]: this.handleMouseUp,
          cursor: this.state.cursor,
          startEvent
        }}
      >
        {React.cloneElement(child, {
          style,
          ref: (node) => {
            this.node = node;

            const { ref } = child;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }
        })}
      </DraggableContext.Provider>
    );
  }
}

Draggable.Handle = DraggableHandle;

Draggable.defaultProps = {
  container: document
};

Draggable.prototypes = {
  container: PropTypes.instanceOf(Element)
};

export default Draggable;
