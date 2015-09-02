import React, { Component } from 'react';
import Container from './Container';
import CustomDragLayer from './CustomDragLayer';
import { DragDropContext } from 'react-dnd';
import SupportsTouch from '../../SupportsTouch';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import TouchBackend from 'react-dnd/modules/backends/Touch';

@DragDropContext(SupportsTouch() ? TouchBackend : HTML5Backend)
export default class ListSelection extends Component {
  constructor(props) {
    super(props);
    React.initializeTouchEvents(true);
  }

  render() {
    // <CustomDragLayer /> should go after Container if to show the component while it is being dragged in a touch scenario
    return (
      <div>
        <p style={{'margin-left':50}}>
          Multi select and drag and drop example
        </p>
        <Container />
      </div>
    );
  }
}
