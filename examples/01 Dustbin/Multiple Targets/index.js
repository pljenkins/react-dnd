import React from 'react';
import Container from './Container';

export default class DustbinMultipleTargets {
  render() {
    return (
      <div>
        <p>
          <b><a href='https://github.com/pljenkins/react-dnd/tree/master/examples/01%20Dustbin/Multiple%20Targets'>Browse the Source</a></b>
        </p>
        <p>
          This is a slightly more interesting example.
        </p>
        <p>
          It demonstrates how a single drop target may accept multiple types, and how those types may be derived from props.
          It also demonstrates the handling of native files and URLs (try dropping them onto the last two dustbins).
        </p>
        <Container />
      </div>
    );
  }
}