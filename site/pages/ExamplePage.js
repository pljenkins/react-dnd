import React from 'react';
import Header from '../components/Header';
import PageBody from '../components/PageBody';
import SideBar from '../components/SideBar';
import { ExamplePages } from '../Constants';

export default class ExamplesPage {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}