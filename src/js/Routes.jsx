import React from 'react';
import { Route, DefaultRoute, Redirect } from 'react-router';

import App from './App';
import Home from './components/Home';
import Room from './components/Room';

export default (
    <Route name="app" handler={App} path="/">
        <DefaultRoute handler={Home} />
        <Route name="room" path="room" handler={Room} />
    </Route>
);
