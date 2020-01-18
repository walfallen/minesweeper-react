import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Board from './Board';

import './global.scss';

ReactDOM.render(
	<div className="app">
		<h1>Minesweeper</h1>
		<Board width={20} height={10} />
	</div>,
	document.getElementById('root'),
);
