import * as React from 'react';

import Room from './game/Room';

import StartScene from './gui/StartScene';
import Board from './gui/Board';

enum Page {
	StartPage = 'start-scene',
	LoadPage = 'load',
	BoardPage = 'board',
}

interface ModeConfig {
	width: number;
	height: number;
}

interface AppState {
	page: Page;
	room: Room | null;
}

const modeConfig = new Map<string, ModeConfig>();
modeConfig.set('expert', { width: 30, height: 20 });
modeConfig.set('medium', { width: 15, height: 10 });
modeConfig.set('easy', { width: 10, height: 8 });

export default class App extends React.Component<{}, AppState> {
	constructor(props: {}) {
		super(props);

		this.state = {
			page: Page.StartPage,
			room: null,
		};
	}

	handleModeChange = async (mode: string): Promise<void> => {
		const config = modeConfig.get(mode);
		if (!config) {
			return;
		}

		this.setState({
			page: Page.LoadPage,
		});

		const room = new Room(config.width, config.height);
		await room.create();

		this.setState({
			page: Page.BoardPage,
			room,
		});
	}

	render(): JSX.Element {
		const { page } = this.state;
		const { room } = this.state;

		return (
			<div className={`app ${page}`}>
				<h1>Minesweeper</h1>
				{page === Page.StartPage && <StartScene onModeChanged={this.handleModeChange} />}
				{page === Page.BoardPage && room && <Board room={room} /> }
			</div>
		);
	}
}
