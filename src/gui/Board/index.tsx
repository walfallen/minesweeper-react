import * as React from 'react';

import Room from '../../game/Room';

import InfoPanel from './InfoPanel';
import ControlPanel from './ControlPanel';
import Square from './Square';

import './index.scss';

interface BoardProps {
	room: Room;
	onExit: () => void;
}

export default class Board extends React.Component<BoardProps, {}> {
	handleUncover = (x: number, y: number): void => {
		const { room } = this.props;
		room.uncover(x, y);
	}

	handleOutspread = (x: number, y: number): void => {
		const { room } = this.props;
		room.outspread(x, y);
	}

	handleFlag = (x: number, y: number): void => {
		const { room } = this.props;
		room.flag(x, y);
	}

	handleExit = async (): Promise<void> => {
		const { room } = this.props;
		await room.exit();
		const { onExit } = this.props;
		setTimeout(onExit, 0);
	}

	render(): JSX.Element {
		const { room } = this.props;
		const width = room.getWidth();
		const height = room.getHeight();

		const squares: JSX.Element[] = [];
		for (let j = 0; j < height; j++) {
			for (let i = 0; i < width; i++) {
				const square = room.getSquare(i, j);
				if (!square) {
					continue;
				}

				const sqr = (
					<Square
						key={`${i}x${j}`}
						x={i}
						y={j}
						square={square}
						onUncover={this.handleUncover}
						onOutspread={this.handleOutspread}
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
				<div className="panel-area">
					<InfoPanel room={room} />
					<ControlPanel onExit={this.handleExit} />
				</div>
				<div className="board" style={style}>
					{squares}
				</div>
			</div>
		);
	}
}
