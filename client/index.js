import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Root from './root';

// Needed for onTouchTap
injectTapEventPlugin();

const rootEl = document.getElementById('react-root');

if (process.env.NODE_ENV === 'development') {
  const {AppContainer} = require('react-hot-loader');

  render(
    <AppContainer>
      <Root />
    </AppContainer>, rootEl
  );

  if (module.hot) {
    module.hot.accept('./root', () => {
      const NextApp = require('./root');
      render(
        <AppContainer>
          <NextApp />
        </AppContainer>, rootEl
      );
    });
  }
} else {
  render(<Root />, rootEl);
}