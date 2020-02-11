import * as React from 'react';

import GameSquare, { Status } from '../../game/Square';

import './Square.scss';

interface SquareProps {
	x: number;
	y: number;
	square: GameSquare;
	onClick: (x: number, y: number) => void;
	onContextMenu: (x: number, y: number) => void;
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

	handleIndicatorChange = (indicator: number): void => {
		this.setState({
			uncovered: true,
			indicator,
		});
		if (indicator < 0) {
			this.setState({ status: Status.Bomb });
		}
	}

	handleClick = (): void => {
		const {
			x,
			y,
			onClick,
		} = this.props;
		onClick(x, y);
	}

	handleStatusChange = (status: Status): void => {
		this.setState({
			uncovered: status !== Status.None,
			status,
		});
	}

	handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
		e.preventDefault();
		const {
			x,
			y,
			onContextMenu,
		} = this.props;
		onContextMenu(x, y);
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
			<div className={classNames.join(' ')} onClick={this.handleClick} onContextMenu={this.handleContextMenu}>
				{indicator > 0 ? indicator : null}
				{icon && <span className={icon} />}
			</div>
		);
	}
}
