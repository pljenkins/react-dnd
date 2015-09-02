import React, { PropTypes } from 'react';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd/modules/backends/HTML5';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
  minWidth: '200px'
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

//const cardSource = {
//  beginDrag(props) {
//    const { id, text, left, top } = props;
//    return { id, text, left, top };  }
//};
//
//function getStyles(props) {
//  const { left, top, isDragging } = props;
//  const transform = `translate3d(${left}px, ${top}px, 0)`;
//
//  return {
//    border: '1px dashed gray',
//    padding: '0.5rem 1rem',
//    marginBottom: '.5rem',
//    backgroundColor: 'white',
//    cursor: 'move',
//    // position: 'absolute',
//    // transform: transform,
//    // WebkitTransform: transform,
//    // IE fallback: hide the real node using CSS when dragging
//    // because IE will ignore our custom "empty image" drag preview.
//    opacity: isDragging ? 0 : 1,
//    height: isDragging ? 0 : ''
//  };
//}

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
    selected: PropTypes.bool.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    supportsTouch: PropTypes.bool.isRequired
  };

  render() {
    const { text, isDragging, connectDragSource, connectDropTarget, selectCard, debounceTouch, selected, supportsTouch } = this.props;
    const opacity = isDragging ? 0 : 1;
    const backgroundColor = selected ? 'lightblue' : style.backgroundColor;
//      <div style={ getStyles(this.props) }>
    var clickTouchEvent = supportsTouch ? {onTouchStart: (e)=>debounceTouch(e, this.props.id)} : {onClick: (e)=>selectCard(e, this.props.id)};
    var tmp = connectDragSource(connectDropTarget(
      <div {...clickTouchEvent} style={{ ...style, opacity, backgroundColor }}>
        {text}
      </div>
    ));
    return tmp;
  }
}