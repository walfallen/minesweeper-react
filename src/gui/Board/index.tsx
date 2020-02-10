import * as React from 'react';

import Square from './Square';

import './index.scss';

interface BoardProps {
	width: number;
	height: number;
}

enum GameState {
	Invalid,
	Started,
	Ended,
}

interface BoardState {
	gameState: GameState;
}

export default class Board extends React.Component<BoardProps, BoardState> {
	id: string;
	key: string;

	constructor(props: BoardProps) {
		super(props);

		this.id = '';
		this.key = '';

		this.state = {
			gameState: GameState.Invalid,
		};
	}

	async componentDidMount() {
		const { width, height } = this.props;
		const res = await window.fetch(`./api/room?width=${width}&height=${height}`, {
			method: 'POST',
		});
		const room = await res.json();
		this.id = room.id;
		this.key = room.key;

		this.setState({ gameState: GameState.Started });
	}

	render(): JSX.Element {
		const {
			width,
			height,
		} = this.props;

		const squares: JSX.Element[] = [];
		for (let j = 0; j < height; j++) {
			for (let i = 0; i < width; i++) {
				const sqr = <Square key={`${i}x${j}`} x={i} y={j} />;
				squares.push(sqr);
			}
		}

		const style = {
			width: `${width * 58}px`,
		};

		return (
			<div className="board" style={style}>
				{squares}
			</div>
		);
	}
}
