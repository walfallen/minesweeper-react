import * as React from 'react';

import StartScene from './StartScene';
import Board from './Board';

enum Page {
	StartPage = 'start-scene',
	BoardPage = 'board',
}

interface ModeConfig {
	width: number;
	height: number;
}

interface AppState {
	page: Page;
	config: ModeConfig;
}

const modeConfig = new Map<string, ModeConfig>();
modeConfig.set('expert', { width: 20, height: 30 });
modeConfig.set('medium', { width: 15, height: 15 });
modeConfig.set('easy', { width: 10, height: 8 });

export default class App extends React.Component<{}, AppState> {
	constructor(props: {}) {
		super(props);

		this.state = {
			page: Page.StartPage,
			config: {
				width: 0,
				height: 0,
			},
		};
	}

	handleModeChange = (mode: string): void => {
		const config = modeConfig.get(mode);
		if (!config) {
			return;
		}

		this.setState({
			page: Page.BoardPage,
			config,
		});
	}

	render(): JSX.Element {
		const { page } = this.state;
		const { config } = this.state;

		return (
			<div className={`app ${page}`}>
				<h1>Minesweeper</h1>
				{page === Page.StartPage && <StartScene onModeChanged={this.handleModeChange} />}
				{page === Page.BoardPage && <Board width={config.width} height={config.height} /> }
			</div>
		);
	}
}
