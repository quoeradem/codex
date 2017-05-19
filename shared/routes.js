import React from 'react';
import {Route, Switch} from 'react-router-dom';

import Home from './components/Home';
import Page from './components/Page';

export const routes = [
  {
    name: 'home',
    exact: true,
    path: '/',
    component: Home
  },
  {
    name: 'page',
    path: '/:page',
    component: Page
  }
]

export function createRoutes() {
  return (
    <Switch>
      {routes.map(route => <Route {...route} key={route.name} />)}
    </Switch>
  )
}