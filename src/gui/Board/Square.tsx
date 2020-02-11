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
	uncovered: boolean;
	status: Status;
	indicator: number;
}

export default class Square extends React.Component<SquareProps, SquareState> {
	constructor(props: SquareProps) {
		super(props);

		this.state = {
			uncovered: false,
			status: Status.None,
			indicator: 0,
		};
	}

	componentDidMount(): void {
		const { square } = this.props;
		square.on('indicatorChanged', this.handleIndicatorChange);
		square.on('statusChanged', this.handleStatusChange);
	}

	componentWillUnmount(): void {
		const { square } = this.props;
		square.off('indicatorChanged', this.handleIndicatorChange);
		square.off('statusChanged', this.handleStatusChange);
	}

	handleIndicatorChange = (indicator: number): void => {
		this.setState({
			uncovered: true,
			indicator,
		});
		if (indicator < 0) {
			this.setState({ status: Status.Bomb });
		}
	}

	handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
		e.preventDefault();
		this.uncover();
	}

	handleStatusChange = (status: Status): void => {
		this.setState({
			uncovered: status !== Status.None,
			status,
		});
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
			uncovered,
			status,
			indicator,
		} = this.state;

		let icon = null;
		const classNames = ['square'];
		if (uncovered) {
			classNames.push('uncovered');

			if (indicator > 0) {
				classNames.push(`indicator-${indicator}`);
			}
			if (status === Status.Flag) {
				icon = 'flag';
			}
		}

		if (status === Status.Bomb) {
			icon = 'bomb';
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
				{indicator > 0 ? indicator : null}
				{icon && <span className={icon} />}
			</div>
		);
	}
}
