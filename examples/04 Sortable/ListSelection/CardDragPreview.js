import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';
import Card from './Card';

const styles = {
  display: 'inline-block'
};

export default class CardDragPreview extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    console.log('CardDragPreview render');
    return (
      <div style={styles}>
        <Card text={text}/>
      </div>
    );
  }
}
