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
  }

  render() {
    // <CustomDragLayer /> should go after Container if to show the component while it is being dragged in a touch scenario
    return (
      <div>
        <p>
          <b><a href='https://github.com/gaearon/react-dnd/tree/master/examples/04%20Sortable/ListSelection'>Browse the Source</a></b>
        </p>
        <p>
          Multi select and drag and drop example
        </p>
        <Container />
      </div>
    );
  }
}
