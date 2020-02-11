import * as React from 'react';

import Room from '../../game/Room';

import Square from './Square';

import './index.scss';

interface BoardProps {
	room: Room;
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
	constructor(props: BoardProps) {
		super(props);

		this.state = {
			gameState: GameState.Started,
		};
	}

	handleClick = (x: number, y: number) => {
		const { room } = this.props;
		room.uncover(x, y);
	}

	handleContextMenu = (x: number, y: number) => {
		const { room } = this.props;
		room.flag(x, y);
	}

	render(): JSX.Element {
		const { room } = this.props;
		const width = room.getWidth();
		const height = room.getHeight();

		const squares: JSX.Element[] = [];
		for (let j = 0; j < height; j++) {
			for (let i = 0; i < width; i++) {
				const sqr = <Square
					key={`${i}x${j}`}
					x={i} y={j}
					square={room.getSquare(i, j)}
					onClick={this.handleClick}
					onContextMenu={this.handleContextMenu}
				/>;
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
