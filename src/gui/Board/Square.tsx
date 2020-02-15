import * as React from 'react';

import GameSquare, { Status } from '../../game/Square';

import './Square.scss';

interface SquareProps {
	x: number;
	y: number;
	square: GameSquare;
	onUncover: (x: number, y: number) => void;
	onFlag: (x: number, y: number) => void;
}

interface SquareState {
	status: Status;
	indicator: number;
	text: string;
}

export default class Square extends React.Component<SquareProps, SquareState> {
	constructor(props: SquareProps) {
		super(props);

		this.state = {
			status: Status.Covered,
			indicator: 0,
			text: '',
		};
	}

	componentDidMount(): void {
		const { square } = this.props;
		square.on('indicatorChanged', this.handleIndicatorChange);
		square.on('statusChanged', this.handleStatusChange);
		square.on('textChanged', this.handleTextChange);
	}

	componentWillUnmount(): void {
		const { square } = this.props;
		square.off('indicatorChanged', this.handleIndicatorChange);
		square.off('statusChanged', this.handleStatusChange);
		square.off('textChanged', this.handleTextChange);
	}

	handleIndicatorChange = (indicator: number): void => {
		this.setState({ indicator });
	}

	handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
		e.preventDefault();
		this.uncover();
	}

	handleStatusChange = (status: Status): void => {
		this.setState({	status });
	}

	handleContextMenu = (e: React.MouseEvent<HTMLDivElement>): void => {
		e.preventDefault();
		this.flag();
	}

	handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
		switch (e.key) {
		case 'Enter':
			this.uncover();
			break;
		case 'Space':
			this.flag();
			break;
		default:
			return;
		}
		e.preventDefault();
	}

	handleTextChange = (text: string): void => {
		this.setState({ text });
	}

	uncover(): void {
		const {
			x,
			y,
			onUncover,
		} = this.props;
		onUncover(x, y);
	}

	flag(): void {
		const {
			x,
			y,
			onFlag,
		} = this.props;
		onFlag(x, y);
	}

	render(): JSX.Element {
		const {
			status,
			indicator,
			text,
		} = this.state;

		const classNames = ['square'];
		if (status === Status.Uncovered) {
			classNames.push('uncovered');
		} else if (status === Status.Flagged) {
			if (text) {
				classNames.push('heart');
			} else {
				classNames.push('flag');
			}
		}

		if (indicator && indicator > 0) {
			classNames.push(`indicator-${indicator}`);
		} else if (indicator < 0) {
			classNames.push('bomb');
		}

		return (
			<div
				className={classNames.join(' ')}
				role="button"
				tabIndex={0}
				onClick={this.handleClick}
				onContextMenu={this.handleContextMenu}
				onKeyDown={this.handleKeyDown}
			>
				{indicator && indicator > 0 ? indicator : null}
				<span className="content">{text}</span>
			</div>
		);
	}
}
