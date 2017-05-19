import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import {createRoutes} from '../shared/routes';
import App from '../shared/components';

const pages = window.__pages__;

export default class Root extends Component {
  render() {
    return (
      <Router>
        <App pages={pages} children={createRoutes()} />
      </Router>
    );
  }
}