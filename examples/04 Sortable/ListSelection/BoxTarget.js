import React, { PropTypes, Component } from 'react';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';

const style = {
  border: '1px dashed black',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
  minWidth: '150px',
  minHeight: '40px'
};

const cardTarget = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    props.moveCardToBox(draggedId);
  }
};

@DropTarget(ItemTypes.CARD, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class BoxTarget extends Component{
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    moveCardToBox: PropTypes.func.isRequired
  };

  render() {
    const { items, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDropTarget(
      <div style={{ ...style, opacity }}>
        {items.map(item => <div key={item}>{item}</div>)}
      </div>
    );
  }
}
