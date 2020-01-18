import * as React from 'react';

import './Square.scss';

interface SquareProps {
	x: number;
	y: number;
}

enum Status {
	None,
	Flag,
	Bomb,
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
			<div className={classNames.join(' ')}>
				{indicator > 0 ? indicator : null}
				{icon && <span className={icon} />}
			</div>
		);
	}
}
