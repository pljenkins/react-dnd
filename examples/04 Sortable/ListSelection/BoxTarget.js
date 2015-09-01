import React, { PropTypes } from 'react';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';

const style = {
  border: '1px dashed black',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};

const cardTarget = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;

    if (draggedId !== props.id) {
      props.moveCard(draggedId, props.id);
    }
  }
};

export default class BoxTarget {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired
  };

  render() {
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDropTarget(
      <div style={{ ...style, opacity }}>
        {text}
      </div>
    );
  }
}
