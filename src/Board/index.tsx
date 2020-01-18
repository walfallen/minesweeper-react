import * as React from 'react';

import Square from './Square';

import './index.scss';

interface BoardProps {
	width: number;
	height: number;
}

interface BoardState {
	ended: boolean;
}

export default class Board extends React.Component<BoardProps, BoardState> {
	constructor(props: BoardProps) {
		super(props);

		this.state = {
			ended: false,
		};
	}

	render(): JSX.Element {
		const {
			width,
			height,
		} = this.props;
		const {
			ended,
		} = this.state;

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
