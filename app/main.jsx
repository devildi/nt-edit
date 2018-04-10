import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { BrowserRouter, Route } from 'react-router-dom'

const App1 = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
)

const App2 = () => (
	<BrowserRouter>
		<Route path="/" component={App1}/>
	</BrowserRouter>
)

ReactDOM.render(
  <App2 />,
  document.body.appendChild(document.createElement('div'))
);
