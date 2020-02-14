import * as React from 'react';

import Room from '../../game/Room';

import InfoPanel from './InfoPanel';
import Square from './Square';

import './index.scss';

interface BoardProps {
	room: Room;
}

export default class Board extends React.Component<BoardProps, {}> {
	handleUncover = (x: number, y: number): void => {
		const { room } = this.props;
		room.uncover(x, y);
	}

	handleFlag = (x: number, y: number): void => {
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
				const sqr = (
					<Square
						key={`${i}x${j}`}
						x={i}
						y={j}
						square={room.getSquare(i, j)}
						onUncover={this.handleUncover}
						onFlag={this.handleFlag}
					/>
				);
				squares.push(sqr);
			}
		}

		const style = {
			width: `${width * 58}px`,
		};

		return (
			<div className="room">
				<InfoPanel room={room} />
				<div className="board" style={style}>
					{squares}
				</div>
			</div>
		);
	}
}
