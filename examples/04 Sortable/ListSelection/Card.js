import React, { PropTypes } from 'react';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
  minWidth: '340px'
};

const cardSource = {
  beginDrag(props) {
    props.selectCard({dragging: true}, props.id);
    return { id: props.id };
  },
  endDrag(props, monitor) {
      const didDrop = monitor.didDrop();
  
      if (didDrop) {
        props.completeBoxMove();
      } else {
        props.moveRecentCardsBackFromBox();
      }
    }
};

const cardTarget = {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    props.moveRecentCardsBackFromBox();
  }
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Card {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveRecentCardsBackFromBox: PropTypes.func.isRequired,
    completeBoxMove: PropTypes.func.isRequired,
    selectCard: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
  };

  render() {
    const { text, isDragging, connectDragSource, connectDropTarget, selectCard, selected } = this.props;
    const opacity = isDragging ? 0 : 1;
    const backgroundColor = selected ? 'lightblue' : style.backgroundColor;

    return connectDragSource(connectDropTarget(
      <div onClick={(e)=>selectCard(e, this.props.id)} style={{ ...style, opacity, backgroundColor }}>
        {text}
      </div>
    ));
  }
}
